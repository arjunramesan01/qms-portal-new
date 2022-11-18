import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import styles from './Login.module.scss'
import { useNavigate } from 'react-router-dom';
import cx from 'classnames'


const login_creds_username = 'root@byjus.com'
const login_creds_password = 'root'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const [loginApiLoading, setLoginApiLoading] = useState(false)
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
        setLoginError('')
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
        setLoginError('')
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoginError('')
        if(username !== login_creds_username){
            setLoginError('Incorrect Username')
        }
        else if(password !== login_creds_password){
            setLoginError('Incorrect Password')
        }
        else{
            localStorage.setItem('authToken', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MDVhMzc5MTg2M2YzYTViZTE0YjE0NzgiLCJyb2xlIjoiYnlqdS1hbnN3ZXItcmV2aWV3ZXIiLCJ0aW1lc3RhbXAiOiIyMDIxLTA1LTEwVDEwOjM0OjM4LjUyNloiLCJpYXQiOjE2MjA2NDI4Nzh9.f5xoVcgtvWAOwOnbc-VCMDjRwt7P4Pax5ftUL2TRUJQ')
            navigate('/editor')
        }
    }


    return (
        <div className={styles.loginLayout}>
            <div className={styles.title}>
                Question Editor Portal
            </div>
            <div className={styles.formContainer}>
                <form>
                    <h3 className={styles.loginText}>Sign In</h3>
                    <div className={styles.inputField}>
                        <label>Username</label>
                        <input
                            type="text"
                            className={styles.fc}
                            placeholder="Enter username"
                            onChange={handleUsernameChange}
                            value={username}
                        />
                    </div>
                    <div className={styles.inputField}>
                        <label>Password</label>
                        <input
                            type="password"
                            className={styles.fc}
                            placeholder="Enter password"
                            onChange={handlePasswordChange}
                            value={password}
                        />
                    </div>
                    <div className={styles.loginError}>{loginError ?? null}</div>
                    <div className={styles.submitButton}>
                        <button  className={cx([styles["btn-submit"], styles["btn-primary"]])} disabled={!username || !password} onClick={handleSubmit}>
                            {loginApiLoading ?
                                <div className={styles.loader}>
                                    <Oval
                                        color="#000"
                                        height={18}
                                        width={18}
                                        secondaryColor="#fff"
                                        strokeWidth={4}
                                    />
                                </div>
                                : `Submit`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;