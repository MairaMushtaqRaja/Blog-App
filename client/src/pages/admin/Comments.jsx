import React, { useEffect, useState } from 'react'
import { comments_data } from '../../assets/assets';
import CommentTableItem from '../../components/admin/CommentTableItem';
import { useAppContext } from '../../context/AppContext';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('Not Approved');
  const { axios } = useAppContext();
  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments')
      data.success ? setComments(data.comments) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchComments()
  }, [])
  return (
    <div className='w-full min-h-screen bg-blue-50/50 p-4 md:p-10'>
      <div className='flex justify-between items-center max-w-3xl'>
        <h1>Comments</h1>
        <div className='flex gap-4'>
          <button onClick={() => setFilter('Approved')} className={` shadow-custom-sm  border rounded-full
             px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700'}`}>Approved</button>
          <button onClick={() => setFilter('Not Approved')} className={` shadow-custom-sm  border rounded-full
             px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`}>Not Approved</button>
        </div>
      </div>
      <div className='relative h-4/5 max-w-3xl  overflow-x-auto  mt-6 bg-white shadow  rounded-lg scroll-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3 '>Blog Title & Comments</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden '>Date</th>
              <th scope='col' className='px-6 py-3 '>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.filter((comment) => {
              if (filter === "Approved") return comment.isApproved === true;
              return comment.isApproved === false;
            }).map((comment, index) => <CommentTableItem key={comment._id}
              comment={comment} index={index + 1} fetchComments={fetchComments}
            />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Comments