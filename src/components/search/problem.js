import React, {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import { BiQuestionMark, BiPlus, BiSearch,BiLoaderCircle, BiDisc,BiArrowToBottom} from "react-icons/bi"
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles, fade } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import {db} from "../../api/firebase";
import nextId from "react-id-generator";
import PuffLoader from "react-spinners/PuffLoader";
import {Editor, EditorState,RichUtils} from 'draft-js';

import { css } from "@emotion/core";
// import RichTextEditor from "react-rte";
import Divider from "@material-ui/core/Divider";
import Dialog from '@material-ui/core/Dialog';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Signup from '../signup'


const override = css`
  display: block;
  margin:  10;
  border-color: red;
`;

function Problem(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false)
    const [label, setLabel] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    let [loading, setLoading] = React.useState(true);
    let [color, setColor] = React.useState("white");
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty(),);

    const MAX_LENGTH = 1500;



    const handleCreateQuery = (event) => {
        if (!isEditing){setIsEditing(true)}
        setLabel(event.target.value)
    };

    const handleQuery = async(label) => {
        const query = {
            query: label,
            timeStamp: new Date(),
            responseID: '0'
        };
        const res = await db.collection('queries').add(query);
        await db.collection('queries').doc(res.id).update({
            queryID: res.id
        }).then(function() {
            console.log("RESPONSE ID UPDATE SUCCESS");
        }).catch(function(error) {
            console.error("Error updating RESPONSE ID: ", error);
        });
        query.queryID = res.id;
        props.setQuery(query);
    };

    const sendResponse = (event) => {
        let message = label
        let code = event.keyCode || event.which;
        if(code === 13 && message != '') { //13 is the enter keycode
            // setLabel('');
            handleQuery(message);
            if (color != 'white'){
                setColor('white')
            }
        }
    };

    const onChange = (value) => {
        // setContentState(value);
        setEditorState(value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        if (props.isReturned){setColor('white')}

    }, []);

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            onChange(newState);
            return 'handled';
        }

        return 'not-handled';
    };


    const _handleBeforeInput = () => {
        const currentContent = editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length;
        const selectedTextLength = _getLengthOfSelectedText();

        if (currentContentLength - selectedTextLength > MAX_LENGTH - 1) {
            console.log('you can type max ten characters');

            return 'handled';
        }
    };

    const _handlePastedText = (pastedText) => {
        const currentContent = editorState.getCurrentContent();
        const currentContentLength = currentContent.getPlainText('').length;
        const selectedTextLength = _getLengthOfSelectedText();

        if (currentContentLength + pastedText.length - selectedTextLength > MAX_LENGTH) {
            console.log('you can type max ten characters');

            return 'handled';
        }
    };

    const _getLengthOfSelectedText = () => {
        const currentSelection = editorState.getSelection();
        const isCollapsed = currentSelection.isCollapsed()
        let length = 0;

        if (!isCollapsed) {
            const currentContent = editorState.getCurrentContent();
            const startKey = currentSelection.getStartKey();
            const endKey = currentSelection.getEndKey();
            const startBlock = currentContent.getBlockForKey(startKey);
            const isStartAndEndBlockAreTheSame = startKey === endKey;
            const startBlockTextLength = startBlock.getLength();
            const startSelectedTextLength = startBlockTextLength - currentSelection.getStartOffset();
            const endSelectedTextLength = currentSelection.getEndOffset();
            const keyAfterEnd = currentContent.getKeyAfter(endKey);
            console.log(currentSelection)
            if (isStartAndEndBlockAreTheSame) {
                length += currentSelection.getEndOffset() - currentSelection.getStartOffset();
            } else {
                let currentKey = startKey;

                while (currentKey && currentKey !== keyAfterEnd) {
                    if (currentKey === startKey) {
                        length += startSelectedTextLength + 1;
                    } else if (currentKey === endKey) {
                        length += endSelectedTextLength;
                    } else {
                        length += currentContent.getBlockForKey(currentKey).getLength() + 1;
                    }

                    currentKey = currentContent.getKeyAfter(currentKey);
                };
            }
        }

        return length;
    };

    return (
        <div className={classes.root}>
            <Grid direction={'column'}
                  alignItems = 'center'
                  justify = 'flex-start'
                  container
            >



                    <p style = {{color:'black', fontWeight: 600, fontSize: 20}} > Help me... </p>

                <Box display = 'flex' flexDirection = 'row' alignItems = 'center' justifyContent = 'center'>

                    <ButtonGroup
                        orientation="vertical"
                        aria-label="vertical contained primary button group"
                        variant="contained"
                        className = {classes.buttonGroup}
                        borderRadius = {20}
                        style = {{borderRadius: 20,margin: 20 }}
                    >
                        <Button className={classes.viewButton} >
                            <p style = {{ fontSize: 16, margin: 4}} > Make a decision 🤷‍♂️️ </p>
                        </Button>

                        <Button className={classes.viewButton} >
                            <p style = {{ fontSize: 16, margin: 4}} > Solve a problem 🙅‍♀️️ </p>
                        </Button>
                        <Button className={classes.viewButton} >
                            <p style = {{ fontSize: 16, margin: 4}} > Get more done 🏃‍♂️‍ </p>
                        </Button>
                        <Button className={classes.viewButton} >
                            <p style = {{ fontSize: 16, margin: 4}} > Be more effective 💁‍♀️ </p>
                        </Button>

                    </ButtonGroup>

                <ButtonGroup
                    orientation="vertical"
                    aria-label="vertical contained primary button group"
                    variant="contained"
                    className = {classes.buttonGroup}
                    borderRadius = {20}
                    style = {{borderRadius: 20, margin: 20 }}
                >
                    <Button className={classes.viewButton} >
                        <p style = {{ fontSize: 16, margin: 4}} > Make a decision 🤷‍♂️️ </p>
                    </Button>

                    <Button className={classes.viewButton} >
                        <p style = {{ fontSize: 16, margin: 4}} > Solve a problem 🙅‍♀️️ </p>
                    </Button>
                    <Button className={classes.viewButton} >
                        <p style = {{ fontSize: 16, margin: 4}} > Get more done 🏃‍♂️‍ </p>
                    </Button>
                    <Button className={classes.viewButton} >
                        <p style = {{ fontSize: 16, margin: 4}} > Be more effective 💁‍♀️ </p>
                    </Button>

                </ButtonGroup>
                </Box>


                    <Box
                        className={classes.rteBox}
                        style={{ padding: 0, margin: 20,boxShadow: "0px 2px 10px #C9C9C9"}}
                        alignItems="flex-start"
                        justify='flex-start'
                        display="flex"
                        flexDirection="column"
                        border = {2}
                        borderRadius = {15}
                        borderColor = { 'white'}
                    >
                        <p style = {{color: '#3B3B3C', fontWeight: 800, fontSize: 15, margin: 10,}}> Exercise Board </p>

                        <Divider className={classes.divider}/>

                        <div style = {{ width: 400, margin: 20, minHeight: 200}}>


                        <Editor
                            placeholder="type notes here..."
                            editorState={editorState}
                            // className = {classes.rte}
                            onChange={onChange}
                            handleKeyCommand={handleKeyCommand}
                            handleBeforeInput={_handleBeforeInput}
                            handlePastedText={_handlePastedText}

                        />
                        </div>

                        <Button
                            style = {{margin: 0, backgroundColor:'white', borderRadius: 0}}
                            variant="contained"
                            fullWidth
                            onClick={()=>handleClickOpen()}
                            className={classes.button}
                            startIcon={<BiArrowToBottom style = {{color:'#3B3B3C'}} />}
                        >
                            <p style = {{color:'#3B3B3C',fontWeight: 800, margin: 3}}>
                                SAVE
                            </p>
                        </Button>
                    </Box>







                <Dialog
                    PaperProps={{
                        style: {
                            backgroundColor: '#F0F0F0',
                            borderRadius: 20,
                            borderColor: 'white',
                            border: 2
                        },
                    }}
                    className={classes.subscribePopUp}
                    maxWidth={'xs'}
                    fullWidth={true}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >

                    <Signup handleClose = {handleClose} />
                </Dialog>
            </Grid>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    box: {
        color: "white",
    },
    textField: {
        disableUnderline: true,
        color: 'white',
    },
    buttonGroup: {
        backgroundColor: 'white',
        color:'white'

    },

    tool: {
        color: 'white'

    },

    rte:{

        // overflow: 'hidden',
        fontFamily: "inherit",
        fontColor: 'black',
        color: 'black',
        // borderRadius: 20,
        // borderWidth: 2,
        // borderColor: '#655BFF',

    },

    viewButton:
        {

            radius: "3px",
            backgroundColor: '#826FFF',
            color: "white",
            textTransform: "none"
        },

    rteBox: {
        overflow: 'hidden',
        width: '80%',
    },

    search2: {
        color: "white",
        position: 'relative',
        maxWidth: 450,
        // borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#A8ADBC", 0.15),
        '&:hover': {
            backgroundColor: fade("#A8ADBC", 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '75%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
        },

    },

    subscribePopUp: {
        color: 'black'


    },

    divider: {
        // Theme Color, or use css color in quote
    },
}));

export default Problem;


{/*{isEditing && label !== ''*/}
{/*    ?*/}
{/*    <Button*/}
{/*        variant="outlined"*/}
{/*        onClick = {()=>handleQuery()}*/}
{/*        style={{borderRadius: 5,borderColor: 'white', margin:5, backgroundColor: 'black',}}>*/}
{/*        <p style = {{color: 'white', fontSize: 15, margin: 2, marginRight: 25, marginLeft: 25,fontWeight: 800}}>*/}
{/*            Search*/}
{/*        </p>*/}
{/*    </Button>*/}
{/*    : null*/}
{/*}*/}



{/*{props.isReturned*/}

{/*? <Typewriter*/}
{/*    wrapperClassName={classes.typerWrapper}*/}
{/*    cursorClassNAme={classes.cursor}*/}
{/*    style={{color: 'white'}}*/}
{/*    options={{*/}
{/*    strings: ['Hopefully this helps...'],*/}
{/*    autoStart: true,*/}
{/*    loop: false,*/}
{/*    delay: 40,*/}
{/*    wrapperClassName: classes.typerWrapper,*/}
{/*    deleteSpeed: 8,*/}

{/*}}*/}
{/*    />*/}
{/*    :null*/}





{/*<Box*/}
{/*    className={classes.search2}*/}
{/*    style = {{backgroundColor: 'black', padding: 10, margin: 10,}}*/}
{/*    border = {2}*/}
{/*    borderColor = {color}*/}
{/*    borderRadius = {20}*/}
{/*    alignItems="flex-start"*/}
{/*    justify = 'flex-start'*/}
{/*    display="flex"*/}
{/*    flexDirection="row"*/}
{/*>*/}
{/*    <BiDisc*/}
{/*        size={25}*/}
{/*        style={{color: color, margin: 5}}/>*/}

{/*    <TextField*/}
{/*        placeholder="What can I help with?"*/}
{/*        // multiline*/}
{/*        onChange={(event)=>handleCreateQuery(event)}*/}
{/*        onKeyPress = {(e)=>sendResponse(e)}*/}
{/*        defaultValue= {label}*/}
{/*        fullWidth*/}
{/*        value = {label}*/}
{/*        InputProps= {{className: classes.textField, disableUnderline: true}}*/}
{/*        rowsMax={6}*/}
{/*    />*/}
{/*</Box>*/}
