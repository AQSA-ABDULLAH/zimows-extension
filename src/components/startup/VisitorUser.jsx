import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVisitor,
  loadVisitor,
} from "../../store/features/visitorSlice";

function VisitorUser({ setLoading }) {
  const dispatch = useDispatch();

  const { status: visitorStatus, data } = useSelector((state) => state.visitor);

  useEffect(() => {
    const localVisitor = localStorage.getItem("visitor_data");

    if (!localVisitor) {
      dispatch(fetchVisitor());
    } else {
      dispatch(loadVisitor());
    }
  }, [dispatch]);

  useEffect(() => {
    if (visitorStatus === "success") {
      setLoading(false);
    }
  }, [visitorStatus, setLoading]);

  return null;
}

export default VisitorUser;


