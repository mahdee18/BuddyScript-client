import axiosInstance from './axiosInstance'; 

const API_URL = '/posts';

// --- POSTS ---

/** Creates a new post. */
export const createPost = async (postData) => {
  const { data } = await axiosInstance.post(API_URL, postData);
  return data;
};

/** Fetches all relevant posts.*/
export const getAllPosts = async () => {
  const { data } = await axiosInstance.get(API_URL);
  return data;
};

/** Deletes a specific post by its ID.*/
export const deletePost = async (postId) => {
  const { data } = await axiosInstance.delete(`${API_URL}/${postId}`);
  return data;
};

/** Toggles a like on a post. */
export const likePost = async (postId) => {
  const { data } = await axiosInstance.put(`${API_URL}/${postId}/like`);
  return data;
};

/** Updates the visibility of a post. */
export const updatePostVisibility = async (postId, visibility) => {
  const { data } = await axiosInstance.put(`${API_URL}/${postId}/visibility`, { visibility });
  return data;
};


// --- COMMENTS ---

/** Adds a comment to a post.*/
export const addComment = async (postId, content) => {
  const { data } = await axiosInstance.post(`${API_URL}/${postId}/comments`, { content });
  return data;
};

/** Toggles a like on a comment.*/
export const likeComment = async (postId, commentId) => {
  const { data } = await axiosInstance.put(`${API_URL}/${postId}/comments/${commentId}/like`);
  return data;
};


// --- REPLIES ---

/** Adds a reply to a comment.*/
export const addReply = async (postId, commentId, content) => {
  const { data } = await axiosInstance.post(`${API_URL}/${postId}/comments/${commentId}/reply`, { content });
  return data;
};

/** Toggles a like on a reply. */
export const likeReply = async (postId, commentId, replyId) => {
  const { data } = await axiosInstance.put(`${API_URL}/${postId}/comments/${commentId}/replies/${replyId}/like`);
  return data;
};


// --- LIKERS ---

export const getLikers = async (postId, { commentId, replyId }) => {
  const { data } = await axiosInstance.get(`${API_URL}/${postId}/likers`, {
    params: { commentId, replyId },
  });
  return data;
};