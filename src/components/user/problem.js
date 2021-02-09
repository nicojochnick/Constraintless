import React from 'react';
import Box from '@material-ui/core/Box';
import { BiQuestionMark, BiPlus, BiSearch} from "react-icons/bi"
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles, fade } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import {db} from "../../api/firebase";
import nextId from "react-id-generator";

function Problem(props) {
    const classes = useStyles();
    const [label, setLabel] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);

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
            handleQuery(message)
        }
    };

    return (
        <div className={classes.root}>
            <Grid direction={'column'}
                  alignItems = 'center'
                  justify = {'center'}
                  container style = {{backgroundColor: "black"}}
            >
                <Box
                    className={classes.search2}
                    style = {{backgroundColor: 'black', padding: 10, margin: 10}}
                    border = {2}
                    borderRadius = {20}
                    alignItems="flex-start"
                    justify = 'flex-start'
                    display="flex"
                    flexDirection="row"
                >
                    <BiSearch
                        size = {25}
                        style = {{color: 'white', margin: 5}}
                    />
                    <TextField
                        placeholder="type a problem..."
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
}));

export default Problem;
