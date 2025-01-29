import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Sidebar.css";
import { ChatContext } from '../../contexts/chatContext'

const Sidebar = () => {
    const [newRoom, setNewRoom] = useState('');
    const [newRoomDescription, setNewRoomDescription] = useState('');
    const [rooms, setRooms] = useState([]);
    const [userRooms, setUserRooms] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const APIURL= process.env.NODE_ENV === 'production' ? 'https://jibber-backend.onrender.com' : 'http://localhost:5000';
    const { selectedRoom, setSelectedRoom } = useContext(ChatContext);
    
    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const roomsResponse = await axios.get(`${APIURL}/api/rooms/all`,{ withCredentials: true });
            setRooms(roomsResponse.data);

            const userInfoResponse = await axios.get(`${APIURL}/api/users/profile`,{ withCredentials: true });
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
    }, [navigate,APIURL]);

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

            const response = await axios.post(`${APIURL}/api/rooms/create`, {
                
                name: newRoom,
                description: newRoomDescription,
            },{ withCredentials: true
            });

            setRooms(prevRooms => [...prevRooms, response.data]);
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

            await axios.post(`${APIURL}/api/rooms/join/${roomId}`,{ withCredentials: true });
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

            await axios.post(`${APIURL}/api/rooms/leave/${roomId}`, { withCredentials: true });
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

            await axios.post('/api/users/logout');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            setError('Failed to logout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h2>Rooms</h2>
                <button onClick={() => setIsCreating(!isCreating)}>
                    {isCreating ? 'Cancel' : 'Create Room'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isCreating && (
                <form className="create-room-form" onSubmit={handleCreateRoom}>
                    <input
                        type="text"
                        placeholder="Room Name"
                        value={newRoom}
                        onChange={(e) => setNewRoom(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newRoomDescription}
                        onChange={(e) => setNewRoomDescription(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            )}

            <ul className="rooms-list">
                {loading && <li>Loading...</li>}
                {!loading && rooms.length === 0 && <li>No rooms available.</li>}
                {rooms.map((room) => (
                    <li key={room._id} className={`room-item ${userRooms.includes(room._id) ? 'joined' : ''}`}>
                        <div className="room-select" onClick={() => { if(userRooms.includes(room._id)) setSelectedRoom(room); }}>
                            OPEN 
                        </div>
                        <div className="room-info">
                            <h3>{room.name}</h3>
                            <p>{room.description}</p>
                        </div>
                        {userRooms.includes(room._id) ? (
                            <button onClick={() => handleLeaveRoom(room._id)} disabled={loading}>
                                Leave
                            </button>
                        ) : (
                            <button onClick={() => handleJoinRoom(room._id)} disabled={loading}>
                                Join
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <div className="logout-section">
                <button onClick={handleLogout} disabled={loading}>
                    {loading ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;