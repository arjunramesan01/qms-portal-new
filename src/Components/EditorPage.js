import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Oval } from "react-loader-spinner";
import styles from "./EditorPage.module.scss";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import cx from "classnames";
import logoutIcon from '../assets/logout-icon.svg';
import { isEmpty } from "lodash";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// async function fetchQIDData(qid) {
//     try {
//         const rese = await axios.get(`https://search-api-stg.byjusweb.com/byjus/web_search/get_question_by_id/${qid}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//                 "Access-Control-Allow-Origin": "*"
//             }
//         })
//         return Promise.resolve(rese.data)
//     } catch (err) {
//         return Promise.reject(err)
//     }
// }

const EditorPage = ({ userInfo }) => {
    const navigate = useNavigate();
    const [QID, setQID] = useState('')
    const [QIDError, setQIDError] = useState('')
    const [QIDDataLoading, setQIDDataLoading] = useState(false)
    const [QIDInfoData, setQIDInfoData] = useState({})
    const [quesVal, setQuesVal] = useState('')
    const [solVal, setSolVal] = useState('')

    const handleLogout = () => {
        localStorage.removeItem('authToken')
        navigate('/')
    }

    const handleQIDChange = (event) => {
        setQID(event.target.value)
    }

    const handleSubmitQID = () => {
        setQIDDataLoading(true)
        // fetchQIDData(QID).then(res => {
        fetch(`https://search-api-stg.byjusweb.com/byjus/web_search/get_question_by_id/${QID}`).then(res => res.json()).then(resp_data => {
            setQIDInfoData(resp_data)
            setQIDDataLoading(false);
        }).catch(err => {
            setQIDError(err.response?.data?.message || err.message)
            setQIDDataLoading(false);
        })
    }

    const handleQuestionValueChange = (event) => {
        console.log(event.target.value)
    }

    const handleModifyClick = () => {
        console.log("modify")
        console.log(quesVal, solVal)
    }

    return (
        <div className={styles.editorPagelayout}>
            <div className={styles.videoDetailsHeader}>
                <div className={styles.title}>Audit Video Details</div>
                <div className={styles.userInfo}>
                    <div className={styles.nameType}>
                        <div className={styles.name}>{userInfo?.name}</div>
                        <div className={styles.type}>{userInfo?.role}</div>
                    </div>
                    <div className={styles.icon} onClick={() => handleLogout()}>
                        <img src={logoutIcon} alt="logout" />
                    </div>
                </div>
            </div>
            <div className={styles.QIDInputContainer}>
                <div className={styles.labelText}>Enter QID to fetch Question Info</div>
                <div className={styles.searchBar}>
                    <div><input type="text" value={QID} onChange={handleQIDChange} className={styles.QIDInputBox} placeholder='Enter QID'></input></div>
                    <div><button disabled={!QID} onClick={handleSubmitQID} className={styles.QIDSubmitButton}> Fetch </button></div>
                </div>
                <div className={styles.error}>{QIDError ? `Incorrect QID` : null}</div>
            </div>
            {!isEmpty(QIDInfoData) ?
                <>
                    <h2>Question</h2>
                    <CKEditor
                        editor={ClassicEditor}
                        data={QIDInfoData?.question_Title_Mathjax}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            // console.log({ event, editor, data });
                            setQuesVal(data)
                        }}
                        // onBlur={(event, editor) => {
                        //     console.log('Blur.', editor);
                        // }}
                        // onFocus={(event, editor) => {
                        //     console.log('Focus.', editor);
                        // }}
                    />
                    <h2>Solution</h2>
                    <CKEditor
                        editor={ClassicEditor}
                        data={QIDInfoData?.question_Solution_Mathjax}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            // console.log({ event, editor, data });
                            setSolVal(data)
                        }}
                        // onBlur={(event, editor) => {
                        //     console.log('Blur.', editor);
                        // }}
                        // onFocus={(event, editor) => {
                        //     console.log('Focus.', editor);
                        // }}
                    />
                    <div className={styles.modifyButton} onClick={handleModifyClick}>Modify</div>
                </>
                : null
            }
        </div>
    );
};

export default EditorPage;
