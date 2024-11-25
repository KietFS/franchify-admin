import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface ISpinnerWrapperProps {
    size?: number;
}

const SpinnerWrapper: React.FC<ISpinnerWrapperProps> = (props) => {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Box sx={{display: "flex"}}>
                <CircularProgress size={props.size || 40} sx={{color: 'black'}}/>
            </Box>
        </div>
    );
};

export default SpinnerWrapper;
