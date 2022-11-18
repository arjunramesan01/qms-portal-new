import * as React from "react";
import { useState } from "react";
import styles from "./EditorPage.module.scss";
import { useNavigate } from 'react-router-dom';
import logoutIcon from '../assets/logout-icon.svg';
import { isEmpty } from "lodash";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
            <div className={styles.header}>
                <div className={styles.QIDInputContainer}>
                    <div className={styles.labelText}>Enter Question ID to fetch question :</div>
                    <div className={styles.searchBar}>
                        <div><input type="text" value={QID} onChange={handleQIDChange} className={styles.QIDInputBox} placeholder='Enter question id here...'></input></div>
                        <div><button disabled={!QID} onClick={handleSubmitQID} className={styles.QIDSubmitButton}> Fetch </button></div>
                    </div>
                    <div className={styles.error}>{QIDError ? `Incorrect QID` : null}</div>
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.nameType}>
                        <div className={styles.name}>{userInfo?.name}</div>
                        <div className={styles.icon} onClick={() => handleLogout()}>
                            <span>Logout</span>
                        </div>
                    </div>
                </div>

            </div>
            <br></br>
            {!isEmpty(QIDInfoData) &&
                <>
                    <h4>Question</h4>
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
                    <br></br>
                    <br></br>
                    <hr></hr>
                    <br></br>
                    <h4>Solution</h4>
                    <CKEditor
                        editor={ClassicEditor}
                        data={QIDInfoData?.question_Solution_Mathjax}
                        onReady={editor => {
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setSolVal(data)
                        }}
                        // onBlur={(event, editor) => {
                        //     console.log('Blur.', editor);
                        // }}
                        // onFocus={(event, editor) => {
                        //     console.log('Focus.', editor);
                        // }}
                    />
                    <div className={styles.buttonHolder}>
                        <button className={styles.modifyButton} onClick={handleModifyClick}>Modify</button>
                    </div>
                    <br></br>
                    <br></br>
                </>
            }
        </div>
    );
};

export default EditorPage;
