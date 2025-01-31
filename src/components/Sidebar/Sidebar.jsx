import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "./Sidebar.css";
import { ChatContext } from '../../contexts/chatContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaBars, FaTimes } from 'react-icons/fa';
const APIURL =
    process.env.NODE_ENV === "production"
        ? "https://jibber-backend.onrender.com"
        : "http://localhost:5000";

const Sidebar = () => {
    const [newRoom, setNewRoom] = useState('');
    const [newRoomDescription, setNewRoomDescription] = useState('');
    const [rooms, setRooms] = useState([]);
    const [userRooms, setUserRooms] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const { selectedRoom, setSelectedRoom } = useContext(ChatContext);


    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const roomsResponse = await axios({
                method: 'get',
                url: `${APIURL}/api/rooms/all`,
                withCredentials: true
            });
            setRooms(roomsResponse.data);

            const userInfoResponse = await axios({
                method: 'get',
                url: `${APIURL}/api/users/profile`,
                withCredentials: true
            });
            const userInfo = userInfoResponse.data;

            const joinedRooms = roomsResponse.data
                ?.filter(room => room?.members?.some(member => member?._id === userInfo?._id))
                .map(room => room?._id);
            setUserRooms(joinedRooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to fetch rooms.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);


    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!newRoom.trim()) {
            setError('Room name cannot be empty.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await axios({
                method: 'post',
                url: `${APIURL}/api/rooms/create`,
                data: {
                    name: newRoom,
                    description: newRoomDescription
                },
                withCredentials: true
            });

            setRooms(prevRooms => [...prevRooms, response.data]);
            setUserRooms(prevUserRooms => [...prevUserRooms, response.data._id]);
            setSelectedRoom(response.data);
            setIsCreating(false);
            setNewRoom('');
            setNewRoomDescription('');
        } catch (error) {
            console.error('Error creating room:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to create room.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleJoinRoom = async (roomId) => {
        try {
            setLoading(true);
            setError('');

            await axios({
                method: 'post',
                url: `${APIURL}/api/rooms/join/${roomId}`,
                withCredentials: true
            });
            setUserRooms(prevUserRooms => [...prevUserRooms, roomId]);

            const joinedRoom = rooms.find(room => room._id === roomId);
            if (joinedRoom) {
                setSelectedRoom(joinedRoom);
            }
        } catch (error) {
            console.error('Error joining room:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to join room.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleLeaveRoom = async (roomId) => {
        try {
            setLoading(true);
            setError('');

            await axios({
                method: 'post',
                url: `${APIURL}/api/rooms/leave/${roomId}`,
                data: {},
                withCredentials: true
            });
            setUserRooms(prevUserRooms => prevUserRooms.filter(id => id !== roomId));

            if (selectedRoom && selectedRoom._id === roomId) {
                setSelectedRoom(null);
            }
        } catch (error) {
            console.error('Error leaving room:', error);
            if (error.response) {
                setError(error.response.data.message || 'Failed to leave room.');
                if (error.response.status === 401 || error.response.status === 403) {
                    navigate('/login');
                }
            } else if (error.request) {
                setError('No response from server. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            setLoading(true);
            setError('');

            await axios({
                method: 'post',
                url: `${APIURL}/api/users/logout`,
                withCredentials: true
            });
            localStorage.removeItem('userInfo');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Failed to logout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="hamburger" onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </div>
            <div className={`sidebar-container ${isOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="chat-room-lekha">  Rooms</h2>
                    <i className="fa-solid fa-circle-plus fa-2x" style={{ color: '#1d5087', marginRight: 350, cursor: 'pointer' }} onClick={() => setIsCreating(!isCreating)} >
                        {isCreating ? '' : ''}
                    </i>
                </div>

                {error && <div className="error-message">{error}</div>}

                {isCreating && (
                    <form className="create-room-form" onSubmit={handleCreateRoom}>
                        <input
                            className="room-name-input"
                            type="text"
                            placeholder="Room Name"
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                            required
                        />
                        <input
                            className="room-name-input"
                            type="text"
                            placeholder="Description"
                            value={newRoomDescription}
                            onChange={(e) => setNewRoomDescription(e.target.value)}
                        />
                        <button type="submit" disabled={loading} className="create-room-button">
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                )}

                <ul className="rooms-list">
                    {loading && <li>Loading...</li>}
                    {!loading && rooms.length === 0 && <li>No rooms available.</li>}
                    {rooms.map((room) => (
                        <li key={room._id} className={`room-item ${userRooms.includes(room._id) ? 'joined' : ''}`}>
                            <div className="left-portion">
                                <div className="room-info">
                                    <div className="room-name">{room.name}</div>
                                    <div className="room-description">{room.description}</div>
                                </div>
                                <div className="room-members">
                                    <div className="room-select" onClick={() => { if (userRooms.includes(room._id)) setSelectedRoom(room); }}>
                                        Open
                                    </div>
                                    {userRooms.includes(room._id) ? (
                                        <button className="room-leave" onClick={() => handleLeaveRoom(room._id)} disabled={loading}>
                                            Leave
                                        </button>
                                    ) : (
                                        <button className="room-join" onClick={() => handleJoinRoom(room._id)} disabled={loading}>
                                            Join
                                        </button>
                                    )}
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>

                <div className="logout-section">
                    <button onClick={handleLogout} disabled={loading} className="logout-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                        </svg>
                        {loading ? 'Logging out...' : ''}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;