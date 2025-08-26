import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
function Home() {
  const [showmodal,setshowmodal] = useState(false);
  const [showjoinmodal,setshowjoinmodal] = useState(false);
  const [groupName,setgroupName] = useState('');
  const [groupId,setgroupId] = useState('');
  const [user, setUser] = useState(null);
  Modal.setAppElement('#root');
  const openmodal = () =>{
    setshowmodal(true);
  }
  const closemodal = () =>{
    setshowmodal(false);
  }
  const openjoinmodal = () =>{
    setshowjoinmodal(true);
  }
  const closejoinmodal = () =>{
    setshowjoinmodal(false);
  }
  const getData = async ()=>{
        try{
            const response = await axios.get('http://localhost:5001/api/users/get-current-user',{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }   
            });
            if(response.data.success){
                setUser(response.data.user);
            }else{
                console.log("Failed to fetch user data");
            }
        }catch(error){
            console.log(`Fetching data failed: ${error.message}`);
        }
    }
  const createGroup = async() =>{
      try {
        const res = await axios.post('http://localhost:5001/api/users/create-group', {groupName},{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if(res.data.success && res.data.group){
          console.log("Group created successfully", res.data.group);
          await getData();
          setgroupName('');
          closemodal(); 
        }else{
          console.log("Group creation failed");
        }
      } catch (error) {
        console.log(`Creating group failed: ${error.message}`);
      }
    }
    const joinGroup = async() =>{
      try{
        const res = await axios.post('http://localhost:5001/api/users/join-group', {groupId},{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
        );
        if(res.data.success){
          console.log("Joined group successfully", res.data.group);
          await getData();
          setgroupId('');
          closejoinmodal();
        }else{
          console.log("Joining group failed");
        }
      }catch(error){
        console.log(`Joining group failed: ${error.message}`);
      }
    }
    useEffect(()=>{
      getData();
    },[]);
  return (
   <div>
  <nav className='bg-gray-800 text-white'>
    <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
      <div className='flex items-center space-x-4'>
        <img 
          src="https://cdn-icons-png.flaticon.com/256/25/25231.png" 
          className='h-8' 
          alt='Github Logo Clone'
        />
        <span className="text-2xl font-semibold">GitClub</span>
      </div>
      
      <div className='flex items-center space-x-6'>
        <button className='hover:text-gray-300 transition-colors px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600' onClick={openmodal}>Create Group</button>
        <button className='hover:text-gray-300 transition-colors px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600' onClick={openjoinmodal}>Join group</button>
        <a href="/repositories" className='hover:text-gray-300 transition-colors'>Repositories</a>
        <a href="/profile" className='hover:text-gray-300 transition-colors'>Profile</a>
        <a href="/login" className='hover:text-gray-300 transition-colors'>Logout</a>
      </div>
    </div>
  </nav>
  <main className='bg-black min-h-screen flex flex-col items-center justify-center'>
  <div className='group text-center cursor-default'>
    <h1 className='text-white text-4xl md:text-6xl font-bold mb-4 transition-all duration-300 group-hover:text-5xl md:group-hover:text-7xl'>
      Version Control
    </h1>
    <h2 className='text-white text-3xl md:text-5xl font-semibold mb-8 transition-all duration-300 group-hover:text-4xl md:group-hover:text-6xl'>
      for Student Clubs
    </h2>
    <p className='text-gray-300 text-lg md:text-xl max-w-2xl px-4 transition-all duration-500 group-hover:text-white group-hover:scale-105'>
      Collaborate seamlessly, track every change, and never lose your work again. 
      Perfect for club websites, event planning, and team projects - 
      just like the pros use!
    </p>
  </div>
  <Modal
  isOpen={showmodal}
  onRequestClose={closemodal}
  contentLabel="Create Group"
  className="fixed inset-0 z-50 flex items-center justify-center p-4"
  overlayClassName="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
>
  <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-800 bg-gray-800">
      <h2 className="text-xl font-semibold text-white">Create a Group</h2>
    </div>
    <div className="p-6">
      <form onSubmit={async(e) => { e.preventDefault(); await createGroup();}}>
        <div className="mb-4">
          <label htmlFor="groupName" className="block text-sm font-medium text-gray-300 mb-2">
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            placeholder="e.g. Web Dev Club"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            onChange={(e) => setgroupName(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={closemodal}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  </div>
</Modal>
  <Modal
  isOpen={showjoinmodal}
  onRequestClose={closejoinmodal}
  contentLabel="Create Group"
  className="fixed inset-0 z-50 flex items-center justify-center p-4"
  overlayClassName="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
>
  <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-800 bg-gray-800">
      <h2 className="text-xl font-semibold text-white">Join a Group</h2>
    </div>
    <div className="p-6">
      <form onSubmit={async(e) => { e.preventDefault(); await joinGroup();}}>
        <div className="mb-4">
          <label htmlFor="groupId" className="block text-sm font-medium text-gray-300 mb-2">
            Group ID
          </label>
          <input
            type="text"
            id="groupId"
            name="groupId"
            placeholder="e.g. abc123"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            onChange={(e)=>setgroupId(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={closejoinmodal}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            Join Group
          </button>
        </div>
      </form>
    </div>
  </div>
</Modal>
</main>
<footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-2">
        <h3 className="text-white text-lg font-semibold mb-4">About GitClub</h3>
        <p className="text-sm mb-4">
          A student project exploring version control systems and collaborative development.
          Perfect for student clubs and organizations to manage their projects.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">Twitter</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="https://github.com/Annamalai24500" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">GitHub</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/annamalai-rajkumar-51490a34b/" className="text-gray-400 hover:text-white transition-colors">
            <span className="sr-only">LinkedIn</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-sm hover:text-white transition-colors">Home</a></li>
          <li><a href="#" className="text-sm hover:text-white transition-colors">Features</a></li>
          <li><a href="https://tailwindcss.com" className="text-sm hover:text-white transition-colors">Documentation</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
        <ul className="space-y-2">
          <li className="text-sm">annamalairaj24@gmail.com</li>
          <li className="text-sm">+91 9791906520</li>
          <li className="text-sm">Annamalai R</li>
        </ul>
      </div>
    </div>
    <div className="mt-12 pt-8 border-t border-gray-800 text-center">
      <p className="text-xs text-gray-500">
        © 2025 GitClub. All rights reserved.
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Made with <span className="text-red-500">❤️</span> by Annamalai R
      </p>
    </div>
  </div>
</footer>
</div>
  )
}
export default Home;
