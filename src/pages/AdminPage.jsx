import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [showToiletsMgmt, setShowToiletsMgmt] = useState(true);
  const [showUserMgmt, setShowUsersMgmt] = useState(false);
  const [updateDeleteInputs, setUpdateDeleteInputs] = useState({
    id: '',
    imgurl: '',
    _location: '',
    sex: 'male',
    details: '',
    bidet: 'manual',
    _address: '',
    postalcode: '',
    latitude: '',
    longitude: '',
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteUserConfirmation, setShowDeleteUserConfirmation] =
    useState(false);
  const [userInfo, setUserInfo] = useState({
    id: '',
    userName: '',
    email: '',
  });
  const [userMessages, setUserMessages] = useState();

  // handles success/errors of admin actions
  const showToastMessage = (type, message) => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleToiletsMgmtBtn = () => {
    setShowUsersMgmt(false);
    setShowToiletsMgmt(true);
  };

  const handleUserMgmtBtn = () => {
    setShowToiletsMgmt(false);
    setShowUsersMgmt(true);
  };

  const handleAddToiletBtn = (e) => {
    e.preventDefault();
    let newToilet = {
      imgurl: document.getElementById('imgurlAddToilet').value,
      _location: document.getElementById('locationAddToilet').value,
      sex: document.getElementById('sexAddToilet').value,
      details: document.getElementById('detailsAddToilet').value,
      bidet: document.getElementById('bidetAddToilet').value,
      _address: document.getElementById('addressAddToilet').value,
      postalcode: document.getElementById('postalcodeAddToilet').value,
      latitude: document.getElementById('addlatitude').value,
      longitude: document.getElementById('addlongitude').value,
    };
    createToiletAPI(newToilet);
  };

  const createToiletAPI = async (newToilet) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/toilets/createtoilet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(newToilet),
      });
      const json = await res.json();
      showToastMessage('success', json.message);
      console.log(json);
    } catch (err) {
      showToastMessage('error', 'failed to create user ' + err.message);
    }
  };

  const handleFindToiletIdButton = async (e) => {
    e.preventDefault();
    let toiletId = {
      id: document.getElementById('getToiletInfoIDInput').value,
    };
    try {
      const res = await fetch(`http://127.0.0.1:5001/toilets/getsingletoilet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(toiletId),
      });
      const json = await res.json();
      if (!json[0]) {
        showToastMessage('error', json.message);
      } else {
        setUpdateDeleteInputs({
          id: json[0].id,
          imgurl: json[0].imgurl,
          _location: json[0]._location,
          sex: json[0].sex,
          details: json[0].details,
          bidet: json[0].bidet,
          _address: json[0]._address,
          postalcode: json[0].postalcode,
          latitude: json[0].latitude,
          longitude: json[0].longitude,
        });
      }
    } catch (error) {
      showToastMessage('error', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUpdateDeleteInputs((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleUpdateToiletClicked = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/toilets/updatetoilet`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(updateDeleteInputs),
      });
      const json = await res.json();
      showToastMessage('success', json.message);
    } catch (error) {
      showToastMessage('error', json);
    }
  };

  const handleDeleteToiletClicked = async () => {
    if (!updateDeleteInputs.id) {
      showToastMessage('error', 'Please enter a valid toilet ID to delete');
    } else {
      setShowDeleteConfirmation(!showDeleteConfirmation);
    }
  };

  const reallyDeleteToiletAPI = async () => {
    let data = { id: updateDeleteInputs.id };
    try {
      const res = await fetch(`http://127.0.0.1:5001/toilets/deletetoilet`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.message === 'toilet deleted') {
        showToastMessage('success', json.message);
      } else if (json.message === 'no toilet with this id') {
        showToastMessage('error', json.message);
      }
      setUpdateDeleteInputs({
        id: '',
        imgurl: '',
        _location: '',
        sex: 'male',
        details: '',
        bidet: 'manual',
        _address: '',
        postalcode: '',
      });
      setShowDeleteConfirmation(false);
    } catch (error) {
      showToastMessage('error', json);
    }
  };

  const handleFindUserButton = async (e) => {
    e.preventDefault();
    let data = {
      userName: document.getElementById('username').value,
    };
    try {
      const resUserInfo = await fetch(`http://127.0.0.1:5001/user/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      });

      const userInfoJson = await resUserInfo.json();
      setUserInfo({
        id: userInfoJson[0].id,
        userName: userInfoJson[0].username,
        email: userInfoJson[0].email,
      });

      const resUserMessages = await fetch(
        `http://127.0.0.1:5001/comments/getusercomments/${
          document.getElementById('username').value
        }`,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );

      const userMessagesJson = await resUserMessages.json();
      console.log(userMessagesJson);
      setUserMessages(userMessagesJson);
    } catch (error) {
      showToastMessage('error', 'no such user');
    }
  };

  const handleDeleteUserClicked = async () => {
    if (!userInfo.userName) {
      showToastMessage('error', 'Please enter a username');
    } else {
      setShowDeleteUserConfirmation(!showDeleteUserConfirmation);
    }
  };

  const reallyDeleteUserAPI = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:5001/user/delete/${userInfo.userName}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const json = await res.json();
      if (json.message === 'user deleted') {
        showToastMessage('success', json.message);
      } else showToastMessage('error', json.message);

      document.getElementById('username').value = '';
      setUserInfo({
        id: '',
        userName: '',
        email: '',
      });
      setUserMessages(null);
      setShowDeleteUserConfirmation(false);
    } catch (error) {
      showToastMessage('error', json);
    }
  };

  return (
    <div className="mt-20">
      <ToastContainer />
      <div className="buttons-container">
        <div className="inline-block m-10">
          <button
            className="px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-600 shadow-xl"
            onClick={handleToiletsMgmtBtn}
          >
            Toilets Management
          </button>
        </div>
        <div className="inline-block m-10">
          <button
            className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600 shadow-xl"
            onClick={handleUserMgmtBtn}
          >
            User Management
          </button>
        </div>
      </div>
      {showToiletsMgmt && (
        <div className="toiletmgmt-container">
          <div className="add-toilet-container w-full bg-white px-8 py-8">
            <h2 className="text-3xl font-medium mb-4">Add Toilet</h2>
            <form onSubmit={handleAddToiletBtn}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="imgurl"
                >
                  Image URL
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="imgurlAddToilet"
                  type="text"
                  placeholder="Enter Image URL"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="locationAddToilet"
                  type="text"
                  placeholder="Enter Location"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="location"
                >
                  Sex
                </label>
                <select
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="sexAddToilet"
                  defaultValue="male"
                >
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="unisex">unisex</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="details"
                >
                  Details
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
                  id="detailsAddToilet"
                  type="text"
                  placeholder="Enter Details"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="bidet"
                >
                  Bidet
                </label>
                <select
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="bidetAddToilet"
                  defaultValue="manual"
                >
                  <option value="manual">manual</option>
                  <option value="automatic">automatic</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="addressAddToilet"
                  type="text"
                  placeholder="Enter Address"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="postalcode"
                >
                  Postal Code
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="postalcodeAddToilet"
                  type="text"
                  placeholder="Enter Postal Code"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="latitude"
                >
                  Latitude
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="latitude"
                  type="text"
                  placeholder="Enter latitude"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="addlongitude"
                >
                  Longitude
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="addlongitude"
                  type="text"
                  placeholder="Enter longitude"
                  required
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-auto"
                  type="submit"
                >
                  Create Toilet
                </button>
              </div>
            </form>
          </div>
          <div className="find-and-deleteorupdate-container mt-10 px-8 py-8 bg-stone-100">
            <h2 className="text-3xl font-medium mb-4">Update/Delete Toilet</h2>
            <form onSubmit={handleFindToiletIdButton}>
              <input
                className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="getToiletInfoIDInput"
                type="text"
                placeholder="Enter toilet ID and submit to populate form below"
                required
              />
              <button
                className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mb-4 mx-auto"
                type="submit"
              >
                Get Toilet Info
              </button>
            </form>
            <form>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="toiletID"
                >
                  Toilet ID
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="idFindUpdateDelete"
                  type="text"
                  placeholder="Toilet ID"
                  value={updateDeleteInputs.id}
                  onChange={handleInputChange}
                />
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="imgurl"
                >
                  Image URL
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="imgurl"
                  type="text"
                  placeholder="Enter Image URL"
                  value={updateDeleteInputs.imgurl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="_location"
                >
                  Location
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="_location"
                  type="text"
                  placeholder="Enter Location"
                  value={updateDeleteInputs._location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="location"
                >
                  Sex
                </label>
                <select
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="sex"
                  defaultValue="male"
                  value={updateDeleteInputs.sex}
                  onChange={handleInputChange}
                >
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="unisex">unisex</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="details"
                >
                  Details
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="details"
                  type="text"
                  placeholder="Enter Details"
                  value={updateDeleteInputs.details}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="bidet"
                >
                  Bidet
                </label>
                <select
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="bidet"
                  defaultValue="manual"
                  value={updateDeleteInputs.bidet}
                  onChange={handleInputChange}
                >
                  <option value="manual">manual</option>
                  <option value="automatic">automatic</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="_address"
                >
                  Address
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="_address"
                  type="text"
                  placeholder="Enter Address"
                  value={updateDeleteInputs._address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="postalcode"
                >
                  Postal Code
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="postalcode"
                  type="text"
                  placeholder="Enter Postal Code"
                  value={updateDeleteInputs.postalcode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="latitude"
                >
                  Latitude
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="latitude"
                  type="text"
                  placeholder="Enter latitude"
                  value={updateDeleteInputs.latitude}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="longitude"
                >
                  Longitude
                </label>
                <input
                  className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="longitude"
                  type="text"
                  placeholder="Enter longitude"
                  value={updateDeleteInputs.longitude}
                  onChange={handleInputChange}
                />
              </div>
            </form>
            {showDeleteConfirmation && (
              <div className="mb-10 bg-red-400 w-max mx-auto p-2 rounded">
                <p className="mb-2">
                  Are you sure you want to delete this toilet?
                </p>
                <button
                  className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 mr-20"
                  onClick={reallyDeleteToiletAPI}
                >
                  Yes, delete
                </button>
                <button
                  className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={handleDeleteToiletClicked}
                >
                  No
                </button>
              </div>
            )}
            <div className="items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
                type="button"
                onClick={handleUpdateToiletClicked}
              >
                Update Toilet
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
                type="button"
                onClick={handleDeleteToiletClicked}
              >
                Delete Toilet
              </button>
            </div>
          </div>
        </div>
      )}
      {showUserMgmt && (
        <div className="usermgmt-container">
          <h2 className="text-3xl font-medium mb-4">Find User</h2>
          <form onSubmit={handleFindUserButton}>
            <input
              className="appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter username"
              required
            />
            <button
              className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mb-4 mx-auto"
              type="submit"
            >
              Get User Info
            </button>
          </form>
          <div className="flex justify-center">
            <table className="divide-y divide-gray-200 ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userInfo.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userInfo.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {userInfo.email}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-10 font-bold">User's Messages</div>
          <div className="flex justify-center">
            <table className="divide-y divide-gray-200 ">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toilet ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(userMessages)
                  ? userMessages.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.toilets_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.created_at}
                          </td>
                          <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                            {item.message}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>

          {showDeleteUserConfirmation && (
            <div className="mb-10 bg-red-400 w-max mx-auto p-2 rounded">
              <p className="mb-2">Are you sure you want to delete this user?</p>
              <button
                className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400 mr-20"
                onClick={reallyDeleteUserAPI}
              >
                Yes, delete
              </button>
              <button
                className="px-3 py-1 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={handleDeleteUserClicked}
              >
                No
              </button>
            </div>
          )}
          <div className="items-center">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-2"
              type="button"
              onClick={handleDeleteUserClicked}
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
