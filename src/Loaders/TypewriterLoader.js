import React from 'react';
import './TypewriterLoader.css';
import { Container, Stack } from '@mui/material';

const TypewriterLoader = () => {
  return (
    <Container sx={{background:"none"}}>
      <Stack justifyContent={'center'} alignItems={'center'} sx={{background:"none"}} >
        <div className="typewriter" >
          <div className="slide">
            <i />
          </div>
          <div className="paper" />
          <div className="keyboard" />
        </div>
      </Stack>
    </Container>
  );
};

export default TypewriterLoader;
