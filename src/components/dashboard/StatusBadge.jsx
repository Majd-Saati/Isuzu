import React from 'react';

export const StatusBadge = ({ status, children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approval':
        return {
          bg: 'bg-[rgba(240,254,237,1)]',
          text: 'text-[rgba(37,152,0,1)]',
          icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/0a4eca8ec5f9b9abc96b78675ee4162598180948?placeholderIfAbsent=true'
        };
      case 'pending':
        return {
          bg: 'bg-[rgba(245,162,0,0.1)]',
          text: 'text-[#F5A200]',
          icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/eebf64acc7d29c49855e8309302e877188c22fdf?placeholderIfAbsent=true'
        };
      case 'completed':
        return {
          bg: 'bg-[rgba(240,254,237,1)]',
          text: 'text-[rgba(37,152,0,1)]',
          icon: 'https://api.builder.io/api/v1/image/assets/132ea46dcd5a44718cd3517d9e4e8249/42c482fcf095690144369991890983333a096101?placeholderIfAbsent=true'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          icon: ''
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`${styles.bg} flex items-center gap-[9px] justify-center pl-2 pr-[9px] py-1 rounded-[38px]`}>
      <img
        src={styles.icon}
        className="aspect-[1] object-contain w-4 shrink-0"
        alt=""
      />
      <div className={`${styles.text} text-[13px] font-medium leading-[1.4]`}>
        {children}
      </div>
    </div>
  );
};
