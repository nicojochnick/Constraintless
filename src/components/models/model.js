import React, {useEffect} from 'react';
import {convertFromRaw, Editor, EditorState} from "draft-js";
import Box from "@material-ui/core/Box";
import Divider from '@material-ui/core/Divider';
import { makeStyles, fade } from '@material-ui/core';


function Model(props) {
    const classes = useStyles();

    return (
        <div>
            <Box style = {{margin: 50, maxWidth: 650}}>
                <p style={{color: 'white', fontSize: 45, fontWeight: 800}}> {props.header} </p>
                <img style={{maxHeight: 250}} src={props.img}/>
                <div style={{color: 'white', margin: 10, fontSize: 15}}>
                    <Editor editorState={ EditorState.createWithContent(convertFromRaw(JSON.parse(props.body))) } readOnly={true}/>
                </div>
                <Divider className={classes.divider}/>
            </Box>

        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    divider: {
        // Theme Color, or use css color in quote
        background: 'white',
    },
}));

export default Model;
