import React from 'react';
import {Button, useTheme} from '@mui/material';

interface RestViewButtonProps {
    isActive: boolean;
    onClick: (e: React.MouseEvent) => void;
    label?: string;
}

const RestViewButton: React.FC<RestViewButtonProps> = ({isActive, onClick, label}) => {
    const theme = useTheme();
    
    // isActive 상태에 따라 텍스트 결정
    const buttonText = isActive ? "휴식 게이지 O" : "휴식 게이지 X";
    
    return (
        <Button
            variant={isActive ? "contained" : "outlined"}
            size="small"
            onClick={onClick}
            sx={{
                borderColor: theme.palette.primary.main,
                color: isActive ? 'white' : theme.palette.primary.main,
                backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                mr: 2,
                '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: isActive ? theme.palette.primary.dark : 'rgba(46, 125, 50, 0.04)'
                }
            }}
        >
            {buttonText}
        </Button>
    );
};

export default RestViewButton; 