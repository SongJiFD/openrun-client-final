import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import LayoutFooter from "./footer";
import LayoutHeader from "./header";
import * as s from "./layoutMain.styles";
import LayoutMyPage from "./mypage";
import LayoutNavigation from "./navigation";
import LayoutTopBtn from "./topBtn";
import LayoutAdmin from "./admin";
interface ILayoutProps {
  children: ReactNode;
}

export default function Layout(props: ILayoutProps) {
  const router = useRouter();

  const SHOW_MYPAGE = [
    "/myPage/",
    "/myPage/writtenBoards/",
    "/myPage/proceeding/",
    "/myPage/paymentPoint/",
    "/myPage/favoriteList/",
    "/myPage/settlementList/",
  ];

  const SHOW_BOARD = ["/board/"];
  const HIDDEN_MYPAGE = ["/"];

  const SHOW_ADMIN = [
    "/admin/",
    "/admin/usersChart/",
    "/admin/usersInfo/",
    "/admin/dailyPayments/",
    "/admin/reports/",
    "/admin/adminInfo/",
  ];

  const isShowMyPage = SHOW_MYPAGE.includes(router.asPath);
  const IsHidden = HIDDEN_MYPAGE.includes(router.asPath);
  const isShowBoard = SHOW_BOARD.includes(router.asPath);
  const isShowAdmin = SHOW_ADMIN.includes(router.asPath);

  return (
    <s.Wrapper>
      {!IsHidden && <LayoutNavigation />}
      {!IsHidden && <LayoutHeader />}
      <Container maxWidth="xl">
        {isShowMyPage && <LayoutMyPage />}
        {isShowBoard && <LayoutTopBtn />}
        {isShowAdmin && <LayoutAdmin />}
        <div>{props.children}</div>
      </Container>
      {!IsHidden && <LayoutFooter />}
    </s.Wrapper>
  );
}
