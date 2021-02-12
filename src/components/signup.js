import React from 'react';
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";

function Signup(props) {
    return (
        <div>

            <DialogContent>
                <Grid container direction='column' spacing={0}>

                    <Box>
                        <p style = {{fontSize: 20, fontWeight: 800}}> Subscribe to Save</p>
                        <Divider/>
                        <Box display = 'flex' flexDirection = 'row' justifyContent = 'flex-start' alignItems = 'center'>
                            <p style = {{fontSize: 50, margin:0}}> $5 </p> <p style = {{fontSize: 18, marginTop: 36}}> /month </p>
                            <ul>
                                <li>Save Your Notes</li>
                                <li>Unlimited Searches</li>
                                <li>Access to Exclusive Models</li>
                                <li>Cancel Anytime</li>
                            </ul>
                        </Box>

                        <Divider/>


                    </Box>

                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="default">
                    Cancel
                </Button>
                <Button onClick={props.handleClose} color="default">
                    Subscribe
                </Button>
            </DialogActions>


        </div>
    );
}

export default Signup;
