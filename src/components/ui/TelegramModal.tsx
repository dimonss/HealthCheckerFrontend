import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { UndoToastStack, type ToastItemData } from './UndoToast';
import {
  getTelegramLinkCode,
  unlinkTelegram,
  getTelegramChats,
  toggleTelegramChat,
  deleteTelegramChat,
  type TelegramLinkCodeResponse,
  type TelegramChat,
} from '../../api/auth';

import { Send, Copy, Check, ExternalLink, ShieldCheck, Unlink, Trash2, Users, MessageSquare } from 'lucide-react';
import './TelegramModal.css';

interface PendingChatDelete {
  chat: TelegramChat;
  timerId: ReturnType<typeof setTimeout>;
}

interface PendingUnlink {
  telegramId: string;
  timerId: ReturnType<typeof setTimeout>;
}

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal = ({ isOpen, onClose }: TelegramModalProps) => {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [linkData, setLinkData] = useState<TelegramLinkCodeResponse | null>(null);
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [copied, setCopied] = useState(false);

  // Soft deletion states
  const [pendingChatDeletes, setPendingChatDeletes] = useState<PendingChatDelete[]>([]);
  const [pendingUnlink, setPendingUnlink] = useState<PendingUnlink | null>(null);
  const [optimisticUnlinked, setOptimisticUnlinked] = useState(false);

  const pendingChatsRef = useRef(pendingChatDeletes);
  pendingChatsRef.current = pendingChatDeletes;
  const pendingUnlinkRef = useRef(pendingUnlink);
  pendingUnlinkRef.current = pendingUnlink;

  const fetchChats = async () => {
    if (!user?.telegramId || optimisticUnlinked) return;
    try {
      const list = await getTelegramChats();
      // Filter out pending chat deletes
      const activePendingIds = new Set(pendingChatsRef.current.map(p => p.chat.chatId));
      setChats(list.filter(c => !activePendingIds.has(c.chatId)));
    } catch (e) {
      console.error('Failed to fetch Telegram chats:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLinkData(null);
      if (!optimisticUnlinked) {
        fetchChats();
      }
    }
  }, [isOpen, user?.telegramId, optimisticUnlinked]);

  // Flush remaining pending actions on unmount
  useEffect(() => {
    return () => {
      pendingChatsRef.current.forEach(p => {
        clearTimeout(p.timerId);
        deleteTelegramChat(p.chat.chatId).catch(console.error);
      });
      if (pendingUnlinkRef.current) {
        clearTimeout(pendingUnlinkRef.current.timerId);
        unlinkTelegram().then(() => refreshUser()).catch(console.error);
      }
    };
  }, []);

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const data = await getTelegramLinkCode();
      setLinkData(data);
    } catch (e) {
      console.error('Failed to generate Telegram link code:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChatActive = async (chatId: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    setChats(prev => prev.map(c => c.chatId === chatId ? { ...c, isActive: nextActive } : c));
    try {
      await toggleTelegramChat(chatId, nextActive);
    } catch (e) {
      console.error('Failed to toggle chat active state:', e);
      setChats(prev => prev.map(c => c.chatId === chatId ? { ...c, isActive: currentActive } : c));
    }
  };

  // --- Chat Deletion Soft-Delete & Undo ---
  const commitChatDelete = async (item: PendingChatDelete) => {
    try {
      await deleteTelegramChat(item.chat.chatId);
    } catch (e) {
      console.error('Failed to delete chat:', e);
      // Restore on failure
      setChats(prev => [...prev, item.chat]);
    } finally {
      setPendingChatDeletes(prev => prev.filter(p => p.chat.chatId !== item.chat.chatId));
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const target = chats.find(c => c.chatId === chatId);
    if (!target) return;

    // Optimistically remove from visible list
    setChats(prev => prev.filter(c => c.chatId !== chatId));

    const timerId = setTimeout(() => {
      commitChatDelete({ chat: target, timerId });
    }, 5000);

    setPendingChatDeletes(prev => [...prev, { chat: target, timerId }]);
  };

  const handleUndoChatDelete = (chatId: string) => {
    const item = pendingChatDeletes.find(p => p.chat.chatId === chatId);
    if (!item) return;

    clearTimeout(item.timerId);
    setPendingChatDeletes(prev => prev.filter(p => p.chat.chatId !== chatId));
    setChats(prev => [...prev, item.chat]);
  };

  const handleConfirmChatDelete = (chatId: string) => {
    const item = pendingChatDeletes.find(p => p.chat.chatId === chatId);
    if (!item) return;

    clearTimeout(item.timerId);
    commitChatDelete(item);
  };

  // --- Account Unlink Soft-Delete & Undo ---
  const commitUnlink = async () => {
    try {
      await unlinkTelegram();
      await refreshUser();
      setChats([]);
      setLinkData(null);
    } catch (e) {
      console.error('Failed to unlink Telegram:', e);
      setOptimisticUnlinked(false);
    } finally {
      setPendingUnlink(null);
      setOptimisticUnlinked(false);
    }
  };

  const handleUnlink = () => {
    if (!user?.telegramId) return;

    const originalTelegramId = user.telegramId;
    setOptimisticUnlinked(true);

    const timerId = setTimeout(() => {
      commitUnlink();
    }, 5000);

    setPendingUnlink({ telegramId: originalTelegramId, timerId });
  };

  const handleUndoUnlink = () => {
    if (!pendingUnlink) return;

    clearTimeout(pendingUnlink.timerId);
    setPendingUnlink(null);
    setOptimisticUnlinked(false);
    fetchChats();
  };

  const handleConfirmUnlink = () => {
    if (!pendingUnlink) return;

    clearTimeout(pendingUnlink.timerId);
    commitUnlink();
  };

  const handleCopyCode = () => {
    if (!linkData) return;
    navigator.clipboard.writeText(`/link ${linkData.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = !!user?.telegramId && !optimisticUnlinked;

  // Build toast stack items
  const toastItems: ToastItemData[] = [
    ...pendingChatDeletes.map(p => ({
      id: `chat-${p.chat.chatId}`,
      message: t('chatDisconnectedToast', { name: p.chat.title || p.chat.chatId }),
      durationMs: 5000,
      onUndo: () => handleUndoChatDelete(p.chat.chatId),
      onClose: () => handleConfirmChatDelete(p.chat.chatId),
    })),
    ...(pendingUnlink ? [{
      id: 'unlink-account',
      message: t('telegramUnlinkedToast'),
      durationMs: 5000,
      onUndo: handleUndoUnlink,
      onClose: handleConfirmUnlink,
    }] : [])
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={t('telegramSettings')}>
        <div className="telegram-modal-content">
          <div className="tg-status-card">
            <div className="tg-icon-wrapper">
              <Send className="tg-icon" size={24} />
            </div>
            <div className="tg-status-info">
              <h4>
                {isConnected ? (
                  <span className="text-connected">
                    <ShieldCheck size={16} /> {t('telegramConnected', { id: user?.telegramId })}
                  </span>
                ) : (
                  <span className="text-not-connected">{t('telegramNotConnected')}</span>
                )}
              </h4>
              <p>{t('telegramConnectDesc')}</p>
            </div>
          </div>

          {isConnected && (
            <div className="tg-unlink-wrapper">
              <Button variant="danger" size="sm" onClick={handleUnlink}>
                <Unlink size={14} /> {t('unlinkTelegramBtn')}
              </Button>
            </div>
          )}

          {!linkData ? (
            <div className="tg-action-section">
              <Button variant="primary" onClick={handleGenerateCode} disabled={loading}>
                <Send size={16} /> {loading ? t('save') : t('generateCode')}
              </Button>
            </div>
          ) : (
            <div className="tg-code-box">
              <span className="tg-code-label">{t('codeValidTime')}</span>
              <div className="tg-code-display">
                <code>/link {linkData.code}</code>
                <button className="tg-copy-btn" onClick={handleCopyCode} title={t('copyCode')}>
                  {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                </button>
              </div>
              {copied && <span className="tg-copied-msg">{t('codeCopied')}</span>}

              <p className="tg-instruction">{t('sendCodeInstruction')}</p>

              <div className="tg-button-group">
                <a
                  href={linkData.botUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary tg-open-btn"
                >
                  <ExternalLink size={16} /> {t('openInTelegram')}
                </a>
              </div>
            </div>
          )}

          {isConnected && chats.length > 0 && (
            <div className="tg-chats-section">
              <h5>{t('linkedChatsTitle', { count: chats.length })}</h5>
              <div className="tg-chats-list">
                {chats.map(chat => (
                  <div key={chat.id} className="tg-chat-item">
                    <div className="tg-chat-item-info">
                      {chat.type === 'private' ? <MessageSquare size={16} /> : <Users size={16} />}
                      <span className="tg-chat-title">{chat.title || chat.chatId}</span>
                      <span className="tg-chat-badge">{chat.type}</span>
                    </div>
                    <div className="tg-chat-item-actions">
                      <label className="tg-switch" title={chat.isActive !== false ? 'Уведомления включены' : 'Уведомления отключены'}>
                        <input
                          type="checkbox"
                          checked={chat.isActive !== false}
                          onChange={() => handleToggleChatActive(chat.chatId, chat.isActive !== false)}
                        />
                        <span className="tg-slider round" />
                      </label>
                      <button
                        className="tg-chat-delete-btn"
                        onClick={() => handleDeleteChat(chat.chatId)}
                        title={t('unsubscribeChat')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <UndoToastStack items={toastItems} />
    </>
  );
};

