import React, { useEffect, useState } from 'react'
import axiosClient from '../axios-client';
import {Link, useNavigate} from "react-router-dom";

export default function Favourite() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    console.log('5');
    navigate('/home');
  };

  return (
    <div>
      Favourite
    </div>
  );
}
