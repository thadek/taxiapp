"use client";
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ButtonProps {
  id: string;
  label: string;
  href: string;
}

const ButtonGroup: React.FC = () => {
    const [activePath, setActivePath] = useState('');
    const pathname = usePathname();

  useEffect(() => {
    // Set the initial path
    setActivePath(pathname);
  }, [pathname]);

  const buttons: ButtonProps[] = [
    { id: 'btn1', label: 'Gestión Taxis', href: '/pages/taxiRealTimeLocation' },
    { id: 'btn2', label: 'Buscar Dirección', href: '/dashboard' },
    { id: 'btn3', label: 'ABM Usuario', href: '/pages/abm/abmUser' },
    { id: 'btn4', label: 'ABM Vehículos', href: '/pages/abm/abmVehicle' },
    { id: 'btn5', label: 'ABM Driver', href: '/pages/abm/abmDriver' },
  ];

  return (
    <StyledWrapper>
      <div className="customCheckBoxHolder">
        {buttons.map(button => (
          <React.Fragment key={button.id}>
            <input className="customCheckBoxInput" id={button.id} type="checkbox" />
            <label className="customCheckBoxWrapper" htmlFor={button.id}>
              <Link href={button.href} className={`customCheckBox ${activePath === button.href ? 'active' : ''}`}>
                  <div className="inner">{button.label}</div>
              </Link>
            </label>
          </React.Fragment>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .customCheckBoxHolder {
    margin: 5px;
    display: flex;
  }

  .customCheckBox {
    width: fit-content;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    padding: 2px 12px;
    background-color: #27272A;
    border-radius: 0px;
    color: white;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-duration: 300ms;
    transition-property: color, background-color, box-shadow;
    display: flex;
    height: 40px;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px 1px 1px 0px;
    outline: none;
    justify-content: center;
    min-width: 55px;
  }

  .customCheckBox:hover,
  .customCheckBox.active {
    background-color: #EAB308;
    color: white;
    box-shadow: rgba(0, 0, 0, 0.23) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.17) 0px 2px 4px 1px;
  }

  .customCheckBox .inner {
    font-size: 18px;
    font-weight: 900;
    pointer-events: none;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-duration: 300ms;
    transition-property: transform;
    transform: translateY(0px);
  }

  .customCheckBox:hover .inner,
  .customCheckBox.active .inner {
    transform: translateY(-2px);
  }

  .customCheckBoxWrapper:first-of-type .customCheckBox {
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    border-right: 0px;
  }

  .customCheckBoxWrapper:last-of-type .customCheckBox {
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    border-left: 0px;
  }

  .customCheckBoxInput {
    display: none;
  }

  .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox {
    background-color: #2d6737;
    color: white;
    box-shadow: rgba(0, 0, 0, 0.23) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.17) 0px 2px 4px 1px;
  }

  .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox .inner {
    transform: translateY(-2px);
  }

  .customCheckBoxInput:checked + .customCheckBoxWrapper .customCheckBox:hover {
    background-color: #34723f;
    box-shadow: rgba(0, 0, 0, 0.26) 0px -4px 1px 0px inset, rgba(255, 255, 255, 0.17) 0px -1px 1px 0px, rgba(0, 0, 0, 0.15) 0px 3px 6px 2px;
  }

  .customCheckBoxWrapper .customCheckBox:hover .inner {
    transform: translateY(-2px);
  }
`;

export default ButtonGroup;