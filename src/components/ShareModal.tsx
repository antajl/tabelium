import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const shareText = 'График работы 2/2 в ночь:';
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e7ddcf]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a] flex items-center justify-center shadow-sm">
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[#252320]">
              Поделиться графиком
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-[#81796e] mt-3 leading-relaxed">
          По этой ссылке график откроется в режиме «только чтение». Посторонние лица смогут просматривать смены, но не смогут изменить ваши данные.
        </p>

        {/* Copy input */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-[#81796e] block mb-1.5">
            Ссылка на график
          </label>
          <div className="flex items-center gap-2">
            <input
              id="share-url-input"
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-xs text-[#252320] font-mono truncate focus:outline-none shadow-2xs"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition flex items-center gap-1.5 shrink-0 shadow-sm ${
                copied
                  ? 'bg-[#e3ede3] text-[#354a38] border border-[#c8dcc9]'
                  : 'bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] border border-[#d8b57a]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Копировать</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Messengers */}
        <div className="mt-4 pt-3 border-t border-[#e7ddcf]">
          <span className="text-xs text-[#81796e] font-medium block mb-2">Отправить в мессенджер:</span>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-full bg-white hover:bg-[#f7f2ea] border border-[#e7ddcf] text-[#252320] text-xs font-semibold transition shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-[#55738a]" strokeWidth={1.5} />
              <span>Telegram</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2 rounded-full bg-white hover:bg-[#f7f2ea] border border-[#e7ddcf] text-[#252320] text-xs font-semibold transition shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#557658]" strokeWidth={1.5} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#e7ddcf] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-2xs"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
