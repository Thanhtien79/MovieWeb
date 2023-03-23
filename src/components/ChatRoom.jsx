import React, { useState } from 'react'
import { over } from 'stompjs'
import Sockjs from 'sockjs-client'

var stompClient = null
export default function ChatRoom() {
    const [publicChats, setPublicChats] = useState([])
    const [privateChats, setPrivateChats] = useState(new Map())
    const [tab, setTab] = useState('CHATROOM')
    const [userData, setUserData] = useState({
        username: '',
        recievername: '',
        connected: false,
        message: '',
    })
    const handleValue = (e) => {
        const { value,name } = e.target
        setUserData({ ...userData, [name]: value })
    }
    const handleMessage = (e) => {
        const { value } = e.target
        setUserData({ ...userData, "message": value })
    }
    const registerUser = () => {
        let Sock = new Sockjs('http://localhost:8080/lecongtien/api/tiendzsocket')
        stompClient = over(Sock)
        stompClient.connect({}, onConnected, onError)
    }
    const onConnected = () => {
        setUserData({ ...userData, connected: true })
        stompClient.subscribe('/chatroom/public', onPublicMessReceived)
        stompClient.subscribe('/user/' + userData.username + '/public', onPrivateMessReceived)
        userJoin();
    }
    const userJoin = () => {
        let chatMess = {
            senderName:userData.username, 
            status:"JOIN"
        };
        stompClient.send('/app/message',{},JSON.stringify(chatMess))
    }
    const onPublicMessReceived = (payload) => {
        let payloadData = JSON.parse(payload.body)
        switch (payloadData.status) {
            case 'JOIN':
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, [])
                    setPrivateChats(new Map(privateChats))
                }
                break
            case 'MESSAGE':
                publicChats.push(payloadData)
                setPublicChats([...publicChats])
                break
        }
    }
    const onError = (err) => {
        console.log("loi ne", err)
    }
    const onPrivateMessReceived = (payload) => {
        let payloadData = JSON.parse(payload)
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payload)
            setPrivateChats(new Map(privateChats))
        } else {
            let list = []
            list.push(payloadData)
            privateChats.set(payloadData.senderName, list)
            setPrivateChats(new Map(privateChats))
        }
    }

    const sendPublicMess = () => {
        if(stompClient){
            let chatMess = {
                senderName:userData.username,
                message:userData.message,
                status:"MESSAGE"
            };
            stompClient.send('/app/message',{},JSON.stringify(chatMess))
            setUserData({...userData,"message":""})
        }
    }
    const sendPrivateMess = () => {
        if(stompClient){
            let chatMess = {
                senderName:userData.username,
                recievername:tab,
                message:userData.message,
                status:"MESSAGE"
            };
            if(userData.username !== tab){
                privateChats.set(tab).push(chatMess);
                setPrivateChats(new Map(privateChats))
            }
            stompClient.send('/app/private-message',{},JSON.stringify(chatMess))
            setUserData({...userData,"message":""})
        }
    }
    return (
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="nember-list">
                        <ul>
                            <li
                                onClick={() => {
                                    setTab('CHATROOM')
                                }}
                                className={`member ${tab === 'CHATROOM' && 'active'}`}
                            >
                                Chat room
                            </li>
                            {[...privateChats.keys()].map((name, index) => (
                                <li
                                    onClick={() => {
                                        setTab(name)
                                    }}
                                    className={`member ${tab === name && 'active'}`}
                                    key={index}
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {tab == 'CHATROOM' && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {publicChats.map((chat, index) => {
                                    ;<li className="message" key={index}>
                                        {chat.senderName !== userData.username && (
                                            <div className="avatar">{chat.senderName}</div>
                                        )}
                                        <div className="message-data">{chat.message}</div>
                                        {chat.senderName === userData.username && (
                                            <div className="avatar self">{chat.senderName}</div>
                                        )}
                                    </li>
                                })}
                            </ul>
                            <div className="send-message">
                                <input name='message' onChange={handleValue} type='text' className='input-message' value={userData.message}/>
                                <button type='button' className='send-button' onClick={sendPublicMess}></button>
                            </div>
                        </div>
                    )}

                    {tab !== 'CHATROOM' && (
                        <div className="chat-content">
                        <ul className="chat-messages">
                            {[...privateChats.get(tab)].map((chat, index) => {
                                <li className="message" key={index}>
                                    {chat.senderName !== userData.username && (
                                        <div className="avatar">{chat.senderName}</div>
                                    )}
                                    <div className="message-data">{chat.message}</div>
                                    {chat.senderName === userData.username && (
                                        <div className="avatar self">{chat.senderName}</div>
                                    )}
                                </li>
                            })}
                            </ul>
                            <div className="send-message">
                                <input name='message' onChange={handleValue} type='text' className='input-message' value={userData.message}/>
                                <button type='button' className='send-button' onClick={sendPrivateMess}></button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="register">
                    <input id="user-name" name='username' value={userData.username} onChange={handleValue} />
                    <button type="button" onClick={registerUser}>
                        connect
                    </button>
                </div>
            )}
        </div>
    )
}
