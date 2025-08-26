import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
Modal.setAppElement('#root');
function Repositories() {
  const [group, setgroup] = useState(null);
  const [user, setuser] = useState(null);
  const [selectedGroupId, setselectedGroupId] = useState(null);
  const [repos, setrepos] = useState([]);
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [files, setfiles] = useState([]);
  const [showcreatemodal, setshowcreatemodal] = useState(false);
  const [showupdatemodal, setshowupdatemodal] = useState(false);
  const [updatename, setupdatename] = useState("");
  const [updatedescription, setupdatedescription] = useState("");
  const [updatefiles, setupdatefiles] = useState([]);
  const [updaterepoid, setupdaterepoid] = useState(null);
  const [showfilecontent, setshowfilecontent] = useState(false);
  const [showrepoid, setshowrepoid] = useState(null);
  const [repofiles, setrepofiles] = useState([]);
  const [versions, setversions] = useState([]);
  const [showversions, setshowversions] = useState(false);
  const [showversioncontent, setshowversioncontent] = useState(false);
  const [version, setversion] = useState(null);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/get-current-user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setuser(res.data.user)
        console.log("user details fetched successfully");
      } else {
        console.log("check endpoints and shit twin");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const getCurrentGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/groups/get-current-group/${selectedGroupId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setgroup(res.data.group);
        console.log("current group set successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const createrepo = async () => {
    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    files.forEach((file) => {
      formdata.append("files", file);
    });
    try {
      const res = await axios.post(`http://localhost:5001/api/repositories/create-repository/${selectedGroupId}`, formdata, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        await getData();
        await getCurrentGroup();
        console.log("Creating repository successfully bro");
        setname("");
        setdescription("");
        setfiles([]);
        setshowcreatemodal(false);
        return;
      } else {
        console.log("some error bro console log everywhere", res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const getrepos = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/repositories/get-repositories/${selectedGroupId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setrepos(res.data.repositories || []);
        console.log("found repos successfully man");
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const deleterepo = async (repoId) => {
    try {
      const res = await axios.delete(`http://localhost:5001/api/repositories/delete-repository/${selectedGroupId}/${repoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        await getData();
        await getCurrentGroup();
        await getrepos();
        console.log("Repository deleted successfully");
      } else {
        console.log("Error", res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const updaterepo = async (repoId) => {
    const updatedata = new FormData();
    updatedata.append("name", updatename);
    updatedata.append("description", updatedescription);
    updatefiles.forEach((file) => {
      updatedata.append("files", file);
    });
    try {
      const res = await axios.put(`http://localhost:5001/api/repositories/update-repository/${selectedGroupId}/${repoId}`, updatedata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      if (res.data.success) {
        await getData();
        await getCurrentGroup();
        await getrepos();
        setupdatedescription("");
        setupdatename("");
        setupdatefiles([]);
        setshowupdatemodal(false);
        setupdaterepoid(null);
        console.log("repository updated successfully my man");
        return;
      } else {
        console.log("error", res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const getrepo = async (repoId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/repositories/get-repository/${selectedGroupId}/${repoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        await getData();
        await getCurrentGroup();
        setshowfilecontent(false);
        setshowrepoid(null);
        setrepofiles([]);
        console.log("Repo fetched successfully buddy");
        return;
      } else {
        console.log("error", res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const getversions = async (repoId) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/versions/get-versions/${selectedGroupId}/${repoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setversions([]);
        setversions(res.data.versions);
        await getData();
        await getCurrentGroup();
        await getrepos();
        console.log("fetched versions successfully man");
        return;
      } else {
        console.log("Some error ig ", res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const getversion = async(versionId,repoId) =>{
    try {
      const res = await axios.get(`http://localhost:5001/api/versions/get-version/${selectedGroupId}/${repoId}/${versionId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      });
      if(res.data.success){
        setversion(null);
        setversion(res.data.version);
        await getData();
        await getCurrentGroup();
        await getrepos();
        setshowversioncontent(true);
        console.log("Version fecthed successfully");
      }else{
        console.log(res.data.message)
      }
    } catch (error) {
      console.log(error.message);
    }
  } 
  const handlegroupchange = async (e) => {
    setselectedGroupId(e.target.value)
  }

  const handlecreatemodalclose = async (e) => {
    setshowcreatemodal(false)
  }

  const handleupdatemodalclose = async (e) => {
    setshowupdatemodal(false);
  }

  const handleshowfilecontents = async (e) => {
    setshowfilecontent(false);
  }
  const handleversioncontent = async()=>{
    setshowversioncontent(false);
  }
  const toggleeffect = async(repoId)=>{
    if(showrepoid == repoId && showversions){
      setshowversions(false);
      setshowrepoid(null);
    }else{
      await getversions(repoId)
      setshowversions(true)
      setshowrepoid(repoId)
    }
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedGroupId) { getCurrentGroup(); getrepos(); }
  }, [selectedGroupId]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <nav className="bg-gray-800 text-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://cdn-icons-png.flaticon.com/256/25/25231.png"
              className="h-8"
              alt="Github Logo Clone"
            />
            <span className="text-2xl font-semibold">GitClub</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              className="hover:text-gray-300 transition-colors px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              disabled={!selectedGroupId}
              onClick={() => { setshowcreatemodal(true) }}
            >
              Create Repository
            </button>
            <a href="/profile" className="hover:text-gray-300 transition-colors">Profile</a>
            <button
              className="hover:text-gray-300 transition-colors"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login")
              }}
            >
              Logout
            </button>
            <a href="/repositories" className="hover:text-gray-300 transition-colors">Repositories</a>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col justify-center items-center pt-8 bg-gray-900 p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <label htmlFor="items" className="block text-white mb-2 font-medium">
            Choose Your Group {user?.name ? `(${user.name})` : ""}
          </label>

          <select
            id="items"
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 hover:border-blue-400 transition-colors duration-200 shadow-sm"
            value={selectedGroupId || ""}
            onChange={(e) => { handlegroupchange(e) }}
          >
            <option value="">Select a group</option>
            {user && user.groups.length > 0 ? user?.groups?.map((grp) => (
              <option
                key={grp.groupId}
                value={grp.groupId}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                {grp.name}
              </option>
            )) : (
              <option disabled>No groups joing some buddy</option>
            )}
          </select>
        </div>

        {group && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              {group.name || group.groupName || "Selected Group"} Repositories
            </h2>

            {repos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <div
                    key={repo._id}
                    className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-white">
                      {repo.name || "Unnamed Repo"}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {repo.description || "No description provided"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Files: {repo.fileCount ?? (repo.repofiles?.length || 0)}
                    </p>
                    <div className="flex items-center mt-2">
                      <i
                        className="fi fi-rr-trash text-xs hover:text-red-400 hover:drop-shadow-[0_0_4px_rgba(248,113,113,0.8)] transition-all duration-300 ml-2 flex-shrink-0 cursor-pointer"
                        onClick={() => { deleterepo(repo._id) }}
                      ></i>
                      <i
                        className="fi fi-br-refresh text-xl hover:text-blue-500 m-2 cursor-pointer"
                        onClick={() => { setshowupdatemodal(true); setupdaterepoid(repo._id) }}
                      >+</i>
                      <button className='hover:text-gray-300 transition-colors px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50' onClick={() => { setshowfilecontent(true); setshowrepoid(repo._id); setrepofiles(repo.repofiles) }}>Show file contents</button>
                      <button className='hover:text-gray-300 transition-colors px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50' onClick={() => { getversions(repo._id);toggleeffect(repo._id);}}> Show/Close versions</button>
                    </div>
                    {showversions && versions.length > 0 ? (
                      versions.map((version) => (
                        <div
                          key={version._id}
                          className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer mb-2 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <i className="fas fa-code-branch text-blue-400 mr-2"></i>
                            <span className="text-white font-medium">Version {version.versionNumber}</span>
                          </div>
                          <span className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded">
                            {version.versionfiles?.length || 0} files
                          </span>
                          <button onClick={()=>{getversion(version._id,repo._id);setshowversioncontent(true)}}>Show file contents</button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 italic py-2 flex items-center">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        No versions available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-300 text-center py-8">
                No repositories in this group
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={showcreatemodal}
          onRequestClose={handlecreatemodalclose}
          contentLabel="Create repo"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <form
            onSubmit={(e) => { e.preventDefault(); createrepo(); }}
            className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-semibold text-center">Create Repository</h2>

            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm">Repository Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setname(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="text-sm">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setdescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="files" className="text-sm">Upload Files</label>
              <input
                type="file"
                multiple
                name="files"
                id="files"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
                onChange={(e) => setfiles(Array.from(e.target.files))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handlecreatemodalclose}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showupdatemodal}
          onRequestClose={handleupdatemodalclose}
          contentLabel=" Update repo"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <form
            onSubmit={(e) => { e.preventDefault(); updaterepo(updaterepoid); }}
            className="bg-gray-900 text-white rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-semibold text-center">Update Repository</h2>

            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-sm">Enter updated Repository Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setupdatename(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="description" className="text-sm">Enter updated repository Description</label>
              <input
                type="text"
                name="description"
                id="description"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setupdatedescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="files" className="text-sm">Upload new Files</label>
              <input
                type="file"
                multiple
                name="files"
                id="files"
                className="p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none"
                onChange={(e) => setupdatefiles(Array.from(e.target.files))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleupdatemodalclose}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={showfilecontent}
          onRequestClose={handleshowfilecontents}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center"
        >
          <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  REPOSITORY FILES
                </h2>
              </div>
              <button
                onClick={handleshowfilecontents}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 hover:scale-110 group"
              >
                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {repofiles && repofiles.length > 0 ? (
              <Tabs className="flex-1 flex flex-col">
                <TabList className="flex bg-gray-800 px-6 border-b border-gray-700 space-x-1 overflow-x-auto">
                  {repofiles.map((file, index) => (
                    <Tab
                      key={file._id || index}
                      className="px-5 py-4 text-sm font-semibold cursor-pointer border-b-2 border-transparent text-gray-400 hover:text-gray-300 transition-all duration-200 whitespace-nowrap
                         hover:bg-gray-700 rounded-t-lg mx-1 min-w-max"
                      selectedClassName="!text-blue-400 !border-blue-500 !bg-gray-900"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate max-w-xs">{file.filename || "Unnamed file"}</span>
                      </div>
                    </Tab>
                  ))}
                </TabList>
                <div className="flex-1 overflow-auto p-6 bg-gray-900">
                  {repofiles.map((file, index) => (
                    <TabPanel key={file._id || index} className="h-full">
                      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-center mb-6 p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{file.filename}</h3>
                              <p className="text-sm text-gray-400">{file.contentType || "Unknown type"}</p>
                            </div>
                          </div>
                          <button
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                            onClick={() => navigator.clipboard.writeText(file.content)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Content</span>
                          </button>
                        </div>
                        <div className="bg-gray-950 rounded-xl p-1 border border-gray-700">
                          <div className="flex justify-between items-center px-4 py-2 bg-gray-900 rounded-t-lg border-b border-gray-700">
                            <span className="text-sm text-gray-400 font-mono">content.txt</span>
                            <span className="text-xs text-gray-500">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm text-gray-200 font-mono max-h-96 leading-relaxed">
                            {file.content || "No content available"}
                          </pre>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Size</p>
                              <p className="text-sm text-white">{file.size ? `${file.size} bytes` : "N/A"}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Type</p>
                              <p className="text-sm text-white">{file.contentType || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                </div>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 p-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold mb-2">EMPTY REPOSITORY</p>
                <p className="text-sm text-gray-500">No files found in this repository</p>
              </div>
            )}
          </div>
        </Modal>
        <Modal
          isOpen={showversioncontent}
          onRequestClose={handleversioncontent}
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center"
        >
          <div className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col border border-gray-700">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  VERSION FILES
                </h2>
              </div>
              <button
                onClick={handleversioncontent}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-200 hover:scale-110 group"
              >
                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {version && version.versionfiles && version.versionfiles.length > 0 ? (
              <Tabs className="flex-1 flex flex-col">
                <TabList className="flex bg-gray-800 px-6 border-b border-gray-700 space-x-1 overflow-x-auto">
                  {version.versionfiles.map((file, index) => (
                    <Tab
                      key={file._id || index}
                      className="px-5 py-4 text-sm font-semibold cursor-pointer border-b-2 border-transparent text-gray-400 hover:text-gray-300 transition-all duration-200 whitespace-nowrap
                         hover:bg-gray-700 rounded-t-lg mx-1 min-w-max"
                      selectedClassName="!text-blue-400 !border-blue-500 !bg-gray-900"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate max-w-xs">{file.filename || "Unnamed file"}</span>
                      </div>
                    </Tab>
                  ))}
                </TabList>
                <div className="flex-1 overflow-auto p-6 bg-gray-900">
                  {version && version.versionfiles.map((file, index) => (
                    <TabPanel key={file._id || index} className="h-full">
                      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                        <div className="flex justify-between items-center mb-6 p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{file.filename}</h3>
                              <p className="text-sm text-gray-400">{file.contentType || "Unknown type"}</p>
                            </div>
                          </div>
                          <button
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                            onClick={() => navigator.clipboard.writeText(file.content)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Content</span>
                          </button>
                        </div>
                        <div className="bg-gray-950 rounded-xl p-1 border border-gray-700">
                          <div className="flex justify-between items-center px-4 py-2 bg-gray-900 rounded-t-lg border-b border-gray-700">
                            <span className="text-sm text-gray-400 font-mono">content.txt</span>
                            <span className="text-xs text-gray-500">{file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}</span>
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm text-gray-200 font-mono max-h-96 leading-relaxed">
                            {file.content || "No content available"}
                          </pre>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Size</p>
                              <p className="text-sm text-white">{file.size ? `${file.size} bytes` : "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Type</p>
                              <p className="text-sm text-white">{file.contentType || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  ))}
                </div>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 p-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold mb-2">EMPTY VERSION</p>
                <p className="text-sm text-gray-500">No files found in this VERSION</p>
              </div>
            )}
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
                <li><a href="/" className="text-sm hover:text-white transition-colors">Home</a></li>
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
  );
}

export default Repositories;