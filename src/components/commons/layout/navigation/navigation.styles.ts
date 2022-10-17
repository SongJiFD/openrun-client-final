import styled from "@emotion/styled";
import { Container, Grid } from "@mui/material";

export const Wrapper = styled.header`
  width: 100%;
  margin: auto;
  height: 40px;
  border-bottom: 2px solid #f2f2f2;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const MenuWrapper = styled(Container)`
  width: 100%;
  height: 100%;
  margin: auto;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const MenuList = styled.div`
  width: 33%;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 10px;
`;

export const Menu = styled.div`
  margin-left: 3%;
  color: #5e5e5e;
  font-size: 0.8rem;
  cursor: pointer;
`;
