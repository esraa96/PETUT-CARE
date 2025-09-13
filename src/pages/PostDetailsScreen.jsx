import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, deleteDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, Comment } from '../models/Post';
import SimpleChatService from '../services/SimpleChatService';
import UserAvatar from '../components/UserAvatar';
import UserProfileModal from '../components/UserProfileModal';

const PostDetailsScreen = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!postId) return;
    
    // Fetch post data
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const post = Post.fromFirestore(postDoc);
          setPostData(post);
          loadPostAuthorData(post);
        } else {
          navigate('/community');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/community');
      } finally {
        setPostLoading(false);
      }
    };
    
    fetchPost();
    
    // Listen to comments
    const unsubscribe = onSnapshot(
      collection(db, 'posts', postId, 'comments'),
      async (snapshot) => {
        const commentsData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const comment = Comment.fromFirestore(docSnap);
            
            try {
              const userDoc = await getDoc(doc(db, 'users', comment.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                comment.authorName = userData.fullName || userData.name || userData.displayName || 'Unknown User';
                comment.authorImage = userData.profileImage;
              } else {
                comment.authorName = 'Unknown User';
              }
            } catch (e) {
              console.error('Error fetching user data:', e);
              comment.authorName = 'Unknown User';
            }
            
            return comment;
          })
        );
        
        commentsData.sort((a, b) => a.timestamp - b.timestamp);
        setComments(commentsData);
      }
    );

    return () => unsubscribe();
  }, [postId, navigate]);

  const loadPostAuthorData = async (post) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', post.userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPostData(prev => ({
          ...prev,
          authorName: userData.fullName || userData.name || userData.displayName || 'Unknown User',
          authorImage: userData.profileImage
        }));
      }
    } catch (e) {
      // Handle error silently
    }
  };

  const startChat = async (otherUserId) => {
    if (!user || user.uid === otherUserId) return;
    
    try {
      const chatId = await SimpleChatService.createOrGetChat(otherUserId);
      const userData = await SimpleChatService.getUserData(otherUserId);
      navigate('/chats', { 
        state: { 
          selectedChat: {
            id: chatId,
            otherUserId,
            otherUserName: userData?.fullName || userData?.name || userData?.displayName || 'Unknown User',
            otherUserImage: userData?.profileImage
          }
        }
      });
    } catch (error) {
      alert('Error starting chat');
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        userId: user.uid,
        postId: postId,
        postOwnerId: postData.userId,
        comment: commentText.trim(),
        timestamp: serverTimestamp(),
      });

      setCommentText('');
    } catch (error) {
      alert('Error adding comment');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        navigate('/community');
        alert('Post deleted successfully');
      } catch (error) {
        alert('Error deleting post');
      }
    }
  };

  const getTopicColor = (topic) => {
    switch (topic) {
      case 'Adoption': return 'bg-green-500';
      case 'Breeding': return 'bg-pink-500';
      default: return 'bg-blue-500';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : timestamp;
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };



  if (postLoading) {
    return (
      <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary_app"></div>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark flex items-center justify-center">
        <div className="text-center py-8">
          <p className="text-neutral dark:text-white">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-secondary-dark">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Back Button */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <button onClick={() => navigate('/community')} className="text-primary_app hover:text-opacity-70 text-sm sm:text-base transition-colors">
            ← Back to Community
          </button>
        </div>

        {/* Post Content */}
        <div className="p-3 sm:p-4">
          <div className="card p-3 sm:p-4 mb-4">
          {/* Author Info */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div 
                className="cursor-pointer hover:opacity-80 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  if (postData.userId && postData.userId !== user?.uid) {
                    setSelectedUserId(postData.userId);
                    setShowProfileModal(true);
                  }
                }}
              >
                <UserAvatar 
                  imageData={postData.authorImage} 
                  userName={postData.authorName || 'Unknown User'} 
                  size="w-8 h-8 sm:w-10 sm:h-10" 
                />
              </div>
              <div className="min-w-0 flex-1">
                <p 
                  className="font-semibold text-sm sm:text-base truncate text-neutral dark:text-white cursor-pointer hover:text-primary_app"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (postData.userId && postData.userId !== user?.uid) {
                      setSelectedUserId(postData.userId);
                      setShowProfileModal(true);
                    }
                  }}
                >
                  {postData.authorName || 'Unknown User'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formatTime(postData.timestamp)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className={`px-2 py-1 rounded-full text-white text-xs ${getTopicColor(postData.topic)}`}>
                {postData.topic}
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                {user?.uid !== postData.userId && (
                  <button
                    onClick={() => startChat(postData.userId)}
                    className="text-primary_app hover:text-opacity-70 p-1"
                    title="Send Message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                )}
                {user?.uid === postData.userId && (
                  <button
                    onClick={deletePost}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

            {/* Content */}
            <p className="mb-3 text-sm sm:text-base leading-relaxed text-neutral dark:text-white">{postData.content}</p>
          
          {/* Image */}
          {postData.imageUrl && (
            <img
              src={`data:image/jpeg;base64,${postData.imageUrl}`}
              alt="Post"
              className="w-64 h-64 object-contain rounded-lg mx-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(postData.imageUrl)}
            />
          )}
          </div>

          {/* Comments Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base sm:text-lg font-bold text-neutral dark:text-white">Comments</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{comments.length}</span>
            </div>

            {/* Comments List */}
            <div className="space-y-2 sm:space-y-3 mb-4 max-h-64 sm:max-h-96 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 sm:p-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div 
                      className="cursor-pointer hover:opacity-80 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (comment.userId && comment.userId !== user?.uid) {
                          setSelectedUserId(comment.userId);
                          setShowProfileModal(true);
                        }
                      }}
                    >
                      <UserAvatar 
                        imageData={comment.authorImage} 
                        userName={comment.authorName || 'Unknown User'} 
                        size="w-6 h-6 sm:w-8 sm:h-8" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                        <span 
                          className="font-semibold text-xs sm:text-sm cursor-pointer hover:text-primary_app truncate"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (comment.userId && comment.userId !== user?.uid) {
                              setSelectedUserId(comment.userId);
                              setShowProfileModal(true);
                            }
                          }}
                        >
                          {comment.authorName || 'Unknown User'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {formatTime(comment.timestamp)}
                        </span>
                        {user?.uid !== comment.userId && (
                          <button
                            onClick={() => startChat(comment.userId)}
                            className="text-primary_app hover:text-opacity-70 flex-shrink-0 p-1"
                            title="Send Message"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed break-words text-neutral dark:text-white">{comment.comment}</p>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4 sticky bottom-0 bg-secondary-light dark:bg-secondary-dark">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addComment()}
                placeholder="Write a comment..."
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-primary_app bg-white dark:bg-[#313340] text-neutral dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={addComment}
                disabled={loading || !commentText.trim()}
                className="bg-primary_app text-white px-3 sm:px-4 py-2 rounded-full hover:bg-opacity-90 disabled:opacity-50 flex-shrink-0 transition-colors"
              >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Profile Modal */}
      <UserProfileModal 
        userId={selectedUserId}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default PostDetailsScreen;