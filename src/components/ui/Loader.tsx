import './Loader.css';

export const Loader = ({ fullScreen }: { fullScreen?: boolean }) => {
  return (
    <div className={`loader-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loader"></div>
    </div>
  );
};
