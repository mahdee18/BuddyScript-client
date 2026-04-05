import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { deletePost } from '../../api/posts';
import { BsBookmark, BsBell, BsEyeSlash, BsPencil, BsTrash } from 'react-icons/bs';
import Swal from 'sweetalert2';

const PostOptionsMenu = ({ post, menuRef, onClose, onPostDeleted }) => {
    const { user, token } = useAuth();
    const isAuthor = post.author._id === user?._id;

    const handleDelete = () => {
        onClose();
        Swal.fire({
            title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deletePost(post._id, token);
                    Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
                    onPostDeleted(post._id);
                } catch (error) {
                    Swal.fire('Failed!', 'Could not delete the post.', 'error');
                }
            }
        });
    };

    const MenuItem = ({ icon, text, onClick, isDestructive = false }) => (
        <button onClick={onClick} className={`flex items-center w-full gap-3 px-4 py-2 text-left text-sm transition-colors duration-150 ${ isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100' }`}>
            <span className="p-2 bg-gray-100 rounded-full">{icon}</span>
            <span className="font-semibold">{text}</span>
        </button>
    );

    return (
        <div ref={menuRef} className="absolute right-0 z-20 w-64 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-2">
            <MenuItem icon={<BsBookmark size={16} />} text="Save Post" />
            <MenuItem icon={<BsBell size={16} />} text="Turn On Notification" />
            <MenuItem icon={<BsEyeSlash size={16} />} text="Hide" />
            {isAuthor && (
                <>
                    <hr className="my-1" />
                    <MenuItem icon={<BsPencil size={16} />} text="Edit Post" />
                    <MenuItem icon={<BsTrash size={16} />} text="Delete Post" onClick={handleDelete} isDestructive />
                </>
            )}
        </div>
    );
};

export default PostOptionsMenu;