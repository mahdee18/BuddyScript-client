import React from 'react';

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

/** Renders a single comment. */
const Comment = React.memo(({ comment, onLike, onReply }) => {

  const authorName = comment.author?.name || 'Anonymous';
  const authorAvatar = comment.author?.avatar || '/default-avatar.png';

  return (
    <div className="flex items-start mt-4 space-x-3">
      <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="p-3 bg-gray-100 rounded-lg">
          <h5 className="font-semibold text-gray-800">{authorName}</h5>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
          <button onClick={onLike} className="font-semibold hover:underline focus:outline-none">Like</button>
          <span>&middot;</span>
          <button onClick={onReply} className="font-semibold hover:underline focus:outline-none">Reply</button>
          <span>&middot;</span>
          <time dateTime={comment.timestamp}>{formatTimestamp(comment.timestamp)}</time>
        </div>
      </div>
    </div>
  );
});

export default Comment;