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
import { css } from "@emotion/core";
import RichTextEditor from "react-rte";
import Divider from "@material-ui/core/Divider";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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
    const [body, setBody] = React.useState(RichTextEditor.createEmptyValue());


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
        setBody(value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {

        if (props.isReturned){setColor('#655BFF')}

    }, []);

    return (
        <div className={classes.root}>
            <Grid direction={'column'}
                  alignItems = 'center'
                  justify = {'center'}
                  container
                  style = {{backgroundColor: "black"}}
            >
                <Box
                    className={classes.search2}
                    style = {{backgroundColor: 'black', padding: 10, margin: 10,}}
                    border = {2}
                    borderColor = {color}
                    borderRadius = {20}
                    alignItems="flex-start"
                    justify = 'flex-start'
                    display="flex"
                    flexDirection="row"
                >
                    <BiDisc
                        size={25}
                        style={{color: color, margin: 5}}/>


                    <TextField
                        placeholder="What can I help with?"
                        // multiline
                        onChange={(event)=>handleCreateQuery(event)}
                        onKeyPress = {(e)=>sendResponse(e)}
                        defaultValue= {label}
                        fullWidth
                        value = {label}
                        InputProps= {{className: classes.textField, disableUnderline: true}}
                        rowsMax={6}
                    />
                </Box>

                {props.isReturned

                    ?

                    <Box
                        className={classes.rteBox}
                        style={{backgroundColor: 'white', padding: 0, margin: 10,}}
                        alignItems="flex-start"
                        justify='flex-start'
                        display="flex"
                        flexDirection="column"
                        border = {3}
                        borderRadius = {20}
                        borderColor = { '#655BFF'}
                    >
                        <p style = {{color: '#4E4D5A', fontWeight: 800, fontSize: 15, margin: 10}}> White Board </p>
                        <Divider className={classes.divider}/>
                        <RichTextEditor
                            value={body}
                            className = {classes.rte}
                            onChange={onChange}
                        />
                        <Button
                            style = {{margin: 0, backgroundColor:'white', borderRadius: 0}}
                            variant="contained"
                            fullWidth
                            onClick={()=>handleClickOpen()}
                            className={classes.button}
                            startIcon={<BiArrowToBottom style = {{color:'#171717'}} />}
                        >
                            <p style = {{color:'#171717',fontWeight: 800, margin: 6}}>
                            SAVE
                            </p>
                        </Button>
                    </Box>



                    :null
                }

                <Dialog maxWidth={'sm'} fullWidth={true} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe to Save </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Saving is a premium feature. Sign up to save your notes.
                        </DialogContentText>
                        <Grid container direction='column' spacing={0}>


                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="default">
                            Cancel
                        </Button>
                        <Button onClick={handleClose} color="default">
                            Subscribe
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    box: {
        color: "white",
    },
    textField: {
        disableUnderline: true,
        color: 'white',
    },

    rte:{
        minHeight: 300,
        overflow: 'hidden',
        fontFamily: "inherit",
        // borderRadius: 20,
        // borderWidth: 2,
        // borderColor: '#655BFF',

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

    divider: {
        // Theme Color, or use css color in quote
        background: 'white',
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
