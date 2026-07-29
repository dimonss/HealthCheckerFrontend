import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  getTelegramLinkCode,
  unlinkTelegram,
  getTelegramChats,
  deleteTelegramChat,
  type TelegramLinkCodeResponse,
  type TelegramChat,
} from '../../api/auth';
import { Send, Copy, Check, ExternalLink, ShieldCheck, Unlink, Trash2, Users, MessageSquare } from 'lucide-react';
import './TelegramModal.css';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal = ({ isOpen, onClose }: TelegramModalProps) => {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [linkData, setLinkData] = useState<TelegramLinkCodeResponse | null>(null);
  const [chats, setChats] = useState<TelegramChat[]>([]);
  const [copied, setCopied] = useState(false);

  const fetchChats = async () => {
    if (!user?.telegramId) return;
    try {
      const list = await getTelegramChats();
      setChats(list);
    } catch (e) {
      console.error('Failed to fetch Telegram chats:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLinkData(null);
      fetchChats();
    }
  }, [isOpen, user?.telegramId]);

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

  const handleUnlink = async () => {
    if (!window.confirm(t('unlinkTelegramBtn') + '?')) return;
    setUnlinking(true);
    try {
      await unlinkTelegram();
      await refreshUser();
      setChats([]);
      setLinkData(null);
    } catch (e) {
      console.error('Failed to unlink Telegram:', e);
    } finally {
      setUnlinking(false);
    }
  };


  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteTelegramChat(chatId);
      setChats(prev => prev.filter(c => c.chatId !== chatId));
    } catch (e) {
      console.error('Failed to delete chat:', e);
    }
  };

  const handleCopyCode = () => {
    if (!linkData) return;
    navigator.clipboard.writeText(`/link ${linkData.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('telegramSettings')}>
      <div className="telegram-modal-content">
        <div className="tg-status-card">
          <div className="tg-icon-wrapper">
            <Send className="tg-icon" size={24} />
          </div>
          <div className="tg-status-info">
            <h4>
              {user?.telegramId ? (
                <span className="text-connected">
                  <ShieldCheck size={16} /> {t('telegramConnected', { id: user.telegramId })}
                </span>
              ) : (
                <span className="text-not-connected">{t('telegramNotConnected')}</span>
              )}
            </h4>
            <p>{t('telegramConnectDesc')}</p>
          </div>
        </div>

        {user?.telegramId && (
          <div className="tg-unlink-wrapper">
            <Button variant="danger" size="sm" onClick={handleUnlink} disabled={unlinking}>
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

        {chats.length > 0 && (
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
                  <button
                    className="tg-chat-delete-btn"
                    onClick={() => handleDeleteChat(chat.chatId)}
                    title={t('unsubscribeChat')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

