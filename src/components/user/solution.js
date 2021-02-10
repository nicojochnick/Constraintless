import React, {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import { BiQuestionMark, BiPlus, BiSearch} from "react-icons/bi"
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core';
import {db} from "../../api/firebase";
import RichTextEditor from 'react-rte';
import Model from "../models/model"
import Divider from "@material-ui/core/Divider"
import {convertFromRaw, RichUtils, Editor, EditorState} from "draft-js";



function Solution(props) {
    const classes = useStyles();
    const [label, setLabel] = React.useState('');
    const [query, setQuery] = React.useState(null);
    const [response,setResponse] = React.useState( null);
    const [img, setImg] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [models, setModels] = React.useState([]);

    const handleEditLabel = (event) => {
        if (!isEditing){setIsEditing(true)}
        setLabel(event.target.value)
    };


    useEffect(() => {

        db.collection("models").where('responseID', "!=", "0")
            .onSnapshot((querySnapshot) => {
            let models = [];
            querySnapshot.forEach((doc) => {
                models.push(doc.data());
            });
            setModels(models)
        });

    }, []);



    let currentQuery = query ? query : props.query;

    return (
        <div className={classes.root}>
            <Grid  container justify={'flex-start'} alignItems = 'center'>
            {!props.response
                ?
                <div>
                    {props.query

                        ? <img
                            src={'https://media.giphy.com/media/xTiTnfZKxrPxYt9iRq/giphy.gif'}/>

                        :
                        <div>
                            {/*<p style = {{color: "white",}}> Make better decisions with A.I.</p>*/}
                            <img
                                src={'https://media.giphy.com/media/xTiTnHN9JLODvS1fr2/giphy.gif'}/>
                            {/*{models.map((item) => <Model header = {item.header} body = {item.body} img = {item.img} />*/}
                        )}
                        </div>
                    }
                </div>
                :
                <div>

                <Model header = {props.response.header} body = {props.response.body} img = {props.response.img} />
                </div>
            }
            </Grid>
        </div>
    );
}



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    box: {
        color: "white"
    },
    textField: {
        disableUnderline: true,
        color: 'white',

    }
}));


export default Solution;
