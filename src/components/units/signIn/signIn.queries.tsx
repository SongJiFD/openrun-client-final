import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const FETCH_LOGIN_USER = gql`
  query fetchLoginUser {
    fetchLoginUser {
      id
      email
      nickName
      phone
      point
      rating
      profileImg
      isAdmin
      # bankAccount
      report
      loginType
      createdAt
      updatedAt
      countByDate
      paymentTotal
      boardTotal
      loginDate
    }
  }
`;
