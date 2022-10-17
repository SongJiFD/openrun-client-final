import { ChangeEvent, useEffect, useState } from "react";
import BoardWriteUI from "./boardWrite.presenter";
import { useMutation } from "@apollo/client";
import { CREATE_BOARD, UPDATE_BOARD } from "./boardWrite.queries";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRecoilState } from "recoil";
import {
  accessTokenState,
  dayState,
  selectorValue,
  timeState,
} from "../../../commons/store";
import MediaQueryMobile from "../../../../commons/mediaQuery/mediaQueryStandardMobile";
import MediaQueryPc from "../../../../commons/mediaQuery/mediaQueryStandardPc";
import { schema } from "../../../../commons/yup/boardWrite";
import { Modal } from "antd";
import MediaQueryUltra from "../../../../commons/mediaQuery/mediaQueryStandardUltra";
import {
  IBoardAddress,
  IBoardCreateEdit,
  IBoardWrite,
} from "./boardWrite.types";

export default function BoardWrite(props: IBoardWrite) {
  const router = useRouter();
  const [accessToken] = useRecoilState(accessTokenState);

  const { register, handleSubmit, formState, setValue, trigger, reset } =
    useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

  useEffect(() => {
    if (props.data !== undefined) {
      reset({
        contents: props.data.fetchBoard.contents,
        address: props.data.fetchBoard.location?.address,
        addressDetail: props.data.fetchBoard.location?.addressDetail,
        image: [props.data.fetchBoard?.image],
      });
    }
  }, [props.data]);

  // mediaQuery
  const isMobile = MediaQueryMobile();
  const isPc = MediaQueryPc();
  const isUltra = MediaQueryUltra();

  // selector, calendar, timePicker 라이브러리 global state
  const [sortValue] = useRecoilState(selectorValue);
  const [dayValue] = useRecoilState(dayState);
  const [timeValue] = useRecoilState<any>(timeState);

  // 주소 state
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const onChangeAddressDetail = (event: ChangeEvent<HTMLInputElement>) => {
    setAddressDetail(event.target.value);
    setValue("addressDetail", event.target.value);
    trigger("addressDetail");
  };

  // 주소 modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onCompleteAddressSearch = (data: IBoardAddress) => {
    setAddress(data.address);
    setZipcode(data.zonecode);
    setValue("address", data.address);
    trigger("address");
    setIsModalOpen(false);
  };
  const onClickAddressSearch = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 웹 에디터 onchange
  const onChangeContents = (value: string) => {
    setValue("contents", value === "<p><br></p>" ? "" : value);
    trigger("contents");
  };

  // 파일 업로드
  const [fileUrls, setFileUrls] = useState<string[]>([""]);
  const onChangeFileUrls = (fileUrl: string, index: number) => {
    const newFileUrls = [...fileUrls];
    newFileUrls[index] = fileUrl;
    setValue("image", newFileUrls);
    trigger("image");
    setFileUrls(newFileUrls);
  };

  useEffect(() => {
    if (props.data?.fetchBoard?.image) {
      setFileUrls([String(props.data?.fetchBoard?.image)]);
    }
  }, [props.data]);

  // 게시물 등록 함수
  const [createBoard] = useMutation(CREATE_BOARD);

  const onClickCreate = async (data: IBoardCreateEdit) => {
    try {
      const result = await createBoard({
        variables: {
          createBoardInput: {
            title: String(data.title),
            contents: String(data.contents),
            price: Number(data.price),
            eventDay: String(dayValue).slice(0, 15),
            eventTime: String(timeValue.$d).slice(16, 21),
            category: String(sortValue),
            location: {
              zipcode: zipcode,
              address: address,
              addressDetail: addressDetail,
            },
            image: [...fileUrls],
          },
        },
      });
      Modal.success({
        title: "Success",
        content: "게시물 등록이 완료되었습니다.",
      });
      router.push(`/board/${result.data.createBoard.id}`);
    } catch (error) {
      if (error instanceof Error)
        Modal.warning({
          title: "Warning",
          content: "포인트가 부족합니다.",
        });
      if (!accessToken) {
        Modal.warning({
          title: "Warning",
          content: "로그인이 필요합니다.",
        });
        router.push("/signIn");
      }
    }
  };

  // 게시물 수정 함수
  const [updateBoard] = useMutation(UPDATE_BOARD);

  const onClickUpdate = async (data: IBoardCreateEdit) => {
    try {
      const result = await updateBoard({
        variables: {
          updateBoardInput: {
            title: String(data.title),
            contents: String(data.contents),
            price: Number(data.price),
            eventDay: String(dayValue).slice(0, 15),
            eventTime: String(timeValue.$d).slice(16, 21),
            category: String(sortValue),
            location: {
              zipcode: zipcode,
              address: address,
              addressDetail: addressDetail,
            },
            image: [...fileUrls],
          },
          boardId: router.query.id,
        },
      });
      Modal.success({
        title: "Success",
        content: "게시물 수정이 완료되었습니다.",
      });
      router.push(`/board/${result.data?.updateBoard.id}`);
    } catch (error) {
      // if (error instanceof Error)
      // console.log(error.message);
    }
  };

  // 페이지 이동 함수
  const onClickMoveToList = () => {
    router.push("/board/");
  };
  const onClickMoveToDetail = () => {
    router.push(`/board/${router.query.id}`);
  };

  return (
    <BoardWriteUI
      isMobile={isMobile}
      isPc={isPc}
      isUltra={isUltra}
      register={register}
      handleSubmit={handleSubmit}
      formState={formState}
      onChangeContents={onChangeContents}
      onClickCreate={onClickCreate}
      onClickUpdate={onClickUpdate}
      address={address}
      zipcode={zipcode}
      onChangeAddressDetail={onChangeAddressDetail}
      isModalOpen={isModalOpen}
      onCompleteAddressSearch={onCompleteAddressSearch}
      onClickAddressSearch={onClickAddressSearch}
      handleOk={handleOk}
      handleCancel={handleCancel}
      onChangeFileUrls={onChangeFileUrls}
      fileUrls={fileUrls}
      isEdit={props.isEdit}
      data={props.data}
      onClickMoveToList={onClickMoveToList}
      onClickMoveToDetail={onClickMoveToDetail}
    />
  );
}
