import React, { useEffect, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import constraintless from "../../assets/constraintless.png";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {BiDoorOpen,BiArrowToRight} from "react-icons/bi";
import {db} from "../../api/firebase";
import { makeStyles, fade } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import firebase from 'firebase/app';
import Query from "../../components/admin/query"
import TextField from "@material-ui/core/TextField/TextField";
import { BiQuestionMark,BiUser, BiPlus, BiSearch} from "react-icons/bi"
import Button from '@material-ui/core/Button';
import {storage} from "../../api/firebase";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from "@material-ui/core/Divider";
import RichTextEditor from 'react-rte';
import {Editor, EditorState,RichUtils} from 'draft-js';
import {convertFromRaw, convertToRaw} from 'draft-js';




export default function Admin(props) {
    const classes = useStyles();
    const [isLoadingImage, setIsLoadingImage] = React.useState(false);
    const [queries, setQueries] = React.useState([]);
    const [responseID, setResponseID] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [imageAsFile, setImageAsFile] = React.useState('');
    const [imageAsUrl, setImageAsUrl] = React.useState(null);
    const [body, setBody] = React.useState(RichTextEditor.createEmptyValue());
    const [header,setHeader] = React.useState('');
    const [error, setError] = React.useState(null);
    const [id, setID] = React.useState()

    // const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty(),);
    const [contentState, setContentState] = React.useState(() => null);

    const handleLogout = async() => {
        firebase.auth().signOut().then(function() {
        }).catch(function(error) {
        });
    };

    const sendResponse = async (responseID, queryID) => {
        let qs = queries;
        for (let q in qs) {
            if (qs[q].queryID == queryID){
                qs.splice(q,1)
            }
        }

        const queryRef = await db.collection('queries').doc(queryID);
        const res = await queryRef.update(
            {responseID: responseID}
        );

        await refreshQueries()

    };



    const refreshQueries = async() => {
        setLoading(true)
        db.collection('queries')
            .where('responseID', '==', '0')
            .onSnapshot((querySnapshot) => {
                    let queries = [];
                    querySnapshot.forEach(function (doc) {
                        queries.push(doc.data())
                    });
                    setQueries(queries);
                }
            );
        setLoading(false)
        //TODO: sortbytimeStamp
    };



    const onChange = (value) => {
        setContentState(value);
        setBody(value);
    };


    const handleUploadModel = async(event) => {
        //TODO: WE NEED TO DO A REQUIREMENTS CHECK
        event.preventDefault();
        try {

            let bodyRaw =  body.toString('raw');
            let uploadHeader = header;
            let uploadID = id;
            let img = imageAsUrl.imgUrl;
            if (imageAsFile) {
                await handleFireBaseUpload(event, imageAsFile);
            }

            let model = {
                body: bodyRaw,
                header: uploadHeader,
                img: img,
                responseID: uploadID,
            };

            await db.collection('models').doc(model.responseID).set(model)
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });

        } catch (error) {
            console.log(error);
            setError({error: error.message});
        }
    };

    const handleImageAsFile = async(e) => {
        console.log('upload')
        setIsLoadingImage(true);
        const image = e.target.files[0];
        await setImageAsFile(image);
        await handleFireBaseUpload(e, image)
        setIsLoadingImage(false);
    };

    const handleFireBaseUpload = async (e, imageAsFile) => {
        e.preventDefault()
        console.log('start of upload')
        if(imageAsFile === '' ) {
            console.error(`not an image, the image file is a ${typeof(imageAsFile)}`)
            return;
        }
        if (imageAsFile) {
            const uploadTask = storage.ref(`/images/${imageAsFile.name}`).put(imageAsFile)
            //initiates the firebase side uploading
            uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    console.log(err)
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref('images').child(imageAsFile.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
                        })
                })
        }
    };



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        refreshQueries()
    }, []);

    return (
        <div>
            <Grid justify='space-between' alignItems={'space-between'} container direction='row'>
                <Grid item >
                    <Link to="/">
                    <img style = {{height: 50, margin: 10}} src={constraintless}/>
                    </Link>
                </Grid>
                <Grid item>
                <IconButton aria-label="delete">
                    <BiPlus onClick = {()=>handleClickOpen()} style = {{color: "white", margin: 20, marginRight: 0}}/>
                </IconButton>

                    <IconButton aria-label="delete">
                        <BiUser onClick = {()=>handleLogout()} style = {{color: "white", margin: 20}}/>
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container justify = 'flex-start' alignItems = 'center' direction='column'>
                <Dialog maxWidth={'sm'} fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create a Model </DialogTitle>
                    <DialogContent>
                        {/*<DialogContentText>*/}
                        {/*    This is a sacred database, please treat it as such.*/}
                        {/*</DialogContentText>*/}
                        <Grid container direction='row' spacing={3}>
                            <Grid item xs = {6} md = {6} lg = {6}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    onChange={(event)=>setHeader(event.target.value)}
                                    id="name"
                                    label="Title"
                                    fullWidth

                                />
                            </Grid>

                            <Grid item xs = {6} md = {6} lg = {6}>

                            <TextField
                                    autoFocus
                                    margin="dense"
                                    onChange={(event)=>setID(event.target.value)}
                                    id="id"
                                    variant={'filled'}

                                    label="ID"
                                />

                            </Grid>
                        </Grid>
                        <Grid container direction ='column'>
                            <Grid item>
                                {imageAsUrl

                                    ? < img  style  = {{height: 200, marginTop: 20, marginBottom: 20}} src = {imageAsUrl.imgUrl} />
                                    : null
                                }
                            </Grid>
                            <Grid item>
                                <input className={classes.input} id="contained-button-file" accept="image/*" type ='file' onChange={handleImageAsFile} />
                                <label htmlFor="contained-button-file">
                                    <Button style ={{backgroundColor: '#4D6DF1', marginTop: 10}} variant="contained" color="primary" component="span">
                                        Upload
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>

                        <Grid style = {{marginTop: 20}}>

                        <RichTextEditor
                            value={body}
                            onChange={onChange}
                        />
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default">
                            Cancel
                        </Button>
                        <Button onClick={handleUploadModel} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                <Grid >
                    {loading
                        ? null
                        : <div>
                            {queries.map((item) =>
                                <Query query={item} sendResponse={sendResponse}/>
                            )}
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: 'black'
    },

    box: {
        color: "white",
        width: 200,
    },

    textField: {
        disableUnderline: true,
        color: 'white',

    },
    container:{
        margin: 20

    },
    formGroup: {
        alignItems: 'center'
    },

    submitButton: {
        margin: 10,
    },

    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        backgroundColor: "#10102F"

    },
    input: {
        display: 'none',
    },
}));

