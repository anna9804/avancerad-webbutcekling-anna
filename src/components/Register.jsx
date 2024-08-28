import React from 'react';
import { useState } from 'react';
import "./register.css";
import { useHistory } from 'react-dom' 

function Register() {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    const history = useHistory

    async function signUp (){
        let item = {name, password, email, avatar}

        let result = await fetch("https://chatify-api.up.railway.app/auth/register ")
        method: "Post"
        body: JSON.stringify(item)
        headers: {
            "Content-Type"; application/json
            "Accept"; application/json    
        }

        result = await result.json()
        localStorage.setItem("user-info", JSON.stringify(result))
    }

    return (
        <div>
            <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className='form-control' placeholder='Namn'/>
            <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} className='form-control' placeholder='Lösenord'/>
            <input type="text" value={email} onChange={(e)=> setEmail(e.target.value)} className='form-control' placeholder='Mail'/>
            <input type="file" value={avatar} onChange={(e)=> setAvatar(e.target.value)}/>
            <button onClick={signUp}>Registrera dig!</button>

        </div>
    );
}

export default Register;