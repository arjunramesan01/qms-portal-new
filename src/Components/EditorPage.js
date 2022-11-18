import * as React from "react";
import { useState } from "react";
import styles from "./EditorPage.module.scss";
import { useNavigate } from 'react-router-dom';
import { isEmpty } from "lodash";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import MathType from '@wiris/mathtype-ckeditor5';

import { API_ENDPOINT } from "../constants";

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
        setQIDDataLoading(true);
        setQIDInfoData({});

        fetch(API_ENDPOINT +  `get_question_by_id/${QID}/`).then(res => res.json()).then(resp_data => {
            setQIDInfoData(resp_data)
            setQIDDataLoading(false);
        }).catch(err => {
            setQIDError(err.response?.data?.message || err.message)
            setQIDDataLoading(false);
        })
    }

    const handleModifyClick = () => {
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
            {QIDDataLoading === true &&
                <span className={styles.loading}>Loading...</span>
            }
            {QIDError && 
                <div className={styles.error}>Could not fetch data</div>
            }

            {!isEmpty(QIDInfoData) &&
                <>
                    <h4>Question</h4>
                    <CKEditor
                        editor={ClassicEditor}
                        data={QIDInfoData?.question_Title_Mathjax}
                        config={ {
                            // plugins: [  ],
                            // toolbar: [ 'MathType', 'ChemType', ]
                        }}

                        onReady={editor => {
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setQuesVal(data)
                        }}
                     
                    />
                    <br></br>
                    <br></br>
                    <hr></hr>
                    <br></br>
                    <h4>Solution</h4>
                    {/* <CKEditor
                        editor={ClassicEditor}
                        data={QIDInfoData?.question_Solution_Mathjax}
                        onReady={editor => {
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setSolVal(data)
                        }}
                    /> */}
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
