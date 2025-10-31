import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  updateHistoryItemClickCount,
  fetchHistory,
  deleteHistory,
} from "../../store/features/historySlice";
import { useCopyToClipboard } from "../../lib/useCopyToClipboard";
import HistoryCard from "./HistoryCard";

// Ye component ab Sidebar ki tarah props lega
function HistoryList({ onClose, onDelete, visitorId, handleReset }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const historyIntervalRef = useRef(null);
  const [copiedItems, setCopiedItems] = useState(new Set());
  const [pendingDeleteIds, setPendingDeleteIds] = useState(new Set());

  const dispatch = useDispatch();
  const allItems = useSelector((state) => state.history.items);
  const currentShortUrl = useSelector((state) => state.shortUrl.shortUrl);
  const currentClicksCount = useSelector((state) => state.shortUrl.clicksCount);
  const { shortUrlId: selectedShortUrlId } = useSelector(
    (state) => state.shortUrl
  );
  const { copyToClipboard } = useCopyToClipboard();

  // ✅ SYNC DISPLAYED ITEM'S COUNT - (Logic from Sidebar.js)
  useEffect(() => {
    if (currentShortUrl && currentClicksCount !== undefined) {
      const currentAlias = currentShortUrl.split("/").pop();
      const currentItem = allItems.find((item) => {
        const itemAlias = item.zimo_ws_url
          ? item.zimo_ws_url.split("/").pop()
          : null;
        return itemAlias === currentAlias;
      });

      if (currentItem && currentItem.clicks_count !== currentClicksCount) {
        dispatch(
          updateHistoryItemClickCount({
            shortUrlId: currentItem.short_url_id,
            clicksCount: currentClicksCount,
          })
        );
      }
    }
  }, [currentClicksCount, currentShortUrl, allItems, dispatch]);

  useEffect(() => {
    if (!visitorId) {
      console.log("⚠️ No visitorId found, skipping history fetch");
      return;
    }
    if (!visitorId) return;
    console.log("🔁 Fetching history for:", visitorId);
    dispatch(fetchHistory(visitorId));
  }, [visitorId, dispatch]);

  // Set up 3-second interval to refresh history data - (Logic from Sidebar.js)
  // useEffect(() => {
  //   if (!visitorId) return;

  //   if (historyIntervalRef.current) {
  //     clearInterval(historyIntervalRef.current);
  //   }

  //   dispatch(fetchHistory(visitorId)); // Fetch immediately

  //   historyIntervalRef.current = setInterval(() => {
  //     dispatch(fetchHistory(visitorId));
  //   }, 3000);

  //   return () => {
  //     if (historyIntervalRef.current) {
  //       clearInterval(historyIntervalRef.current);
  //     }
  //   };
  // }, [visitorId, dispatch]);

  // Handle Copy - (Logic from Sidebar.js)
  const handleCopy = async (url, itemId) => {
    if (url) {
      const success = await copyToClipboard(url);
      if (success) {
        setCopiedItems((prev) => new Set([...prev, itemId]));
        setTimeout(() => {
          setCopiedItems((prev) => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        }, 2000);
      }
    }
  };

  // Utility functions - (Logic from Sidebar.js)
  const getAlias = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      return u.pathname.split("/").filter(Boolean).pop();
    } catch {
      return url.split("/").filter(Boolean).pop();
    }
  };

  const dedupeByAlias = (arr) => {
    const seen = new Set();
    return arr.filter((i) => {
      const a = getAlias(i.zimo_ws_url);
      if (!a || seen.has(a)) return false;
      seen.add(a);
      return true;
    });
  };

  const selectedAlias = getAlias(currentShortUrl);

  // Derive ordered list - (Logic from Sidebar.js)
  const orderedItems = useMemo(() => {
    const list = dedupeByAlias(allItems || []).filter(
      (item) => !pendingDeleteIds.has(item.short_url_id)
    );
    if (!selectedAlias) return list;

    const idx = list.findIndex(
      (i) => getAlias(i.zimo_ws_url) === selectedAlias
    );
    if (idx <= 0) return list;
    return [list[idx], ...list.slice(0, idx), ...list.slice(idx + 1)];
  }, [allItems, selectedAlias, pendingDeleteIds]);

  const isSelected = (item) => {
    if (!currentShortUrl) return false;
    return getAlias(item.zimo_ws_url) === getAlias(currentShortUrl);
  };

  // Handle showing result in main view - (Logic from Sidebar.js)
  const handleShowShortenedResult = async (item) => {
    if (item?.zimo_ws_url) {
      const alias = item.zimo_ws_url.split("/").pop(); // e.g. "nakf6O"
      console.log("Extracted alias:", alias);

      // Open zimo.ws with alias as query param in a new tab
      window.open(`https://zimo.ws/?alias=${alias}`, "_blank");
    }
  };

  // 🗑️ Delete item logic - (Logic from Sidebar.js)
  const handleDeleteClick = async (shortUrlId) => {
    if (deleteConfirm === shortUrlId) {
      if (!visitorId) return console.warn("Missing visitorId");

      setIsDeleting(true);

      if (shortUrlId === selectedShortUrlId) {
        handleReset?.(); // Reset main view if current item is deleted
      }

      setPendingDeleteIds((prev) => new Set(prev).add(shortUrlId)); // Optimistic UI

      try {
        // ✅ Dispatch Redux thunk to delete item (optimistic + backend)
        await dispatch(deleteHistory({ shortUrlId, visitorId })).unwrap();
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setDeleteConfirm(null);
        setIsDeleting(false);
      }
    } else {
      // Ask for delete confirmation
      setDeleteConfirm(shortUrlId);
      setTimeout(() => {
        setDeleteConfirm((prev) => (prev === shortUrlId ? null : prev));
      }, 5000);
    }
  };

  // Handle Share - (Logic from Sidebar.js)
  const handleShare = async (item) => {
    const shareData = {
      title: "WS by ZIMO",
      text: `WS by ZIMO - ${item.zimo_ws_url}`,
      url: item.zimo_ws_url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Sharing failed:", error);
        await copyToClipboard(item.zimo_ws_url); // Fallback to copy
      }
    } else {
      await copyToClipboard(item.zimo_ws_url); // Fallback for desktop
    }
  };

  // Original HistoryList.js render structure
  return (
    <div>
      <AnimatePresence mode="popLayout">
        {orderedItems.map((item) => {
          const alias = getAlias(item.zimo_ws_url);
          return (
            <HistoryCard
              key={alias} // Use stable alias as key
              id={item.short_url_id}
              icon={item.favicon_url || "/assets/default-favicon.png"} // Provide a default
              shortUrl={item.zimo_ws_url}
              title={item.meta_title}
              fullUrl={item.original_url || item.long_url} // Pass full URL for favicon fallback
              time={item.time}
              date={item.date}
              clickCounter={item.clicks_count?.toLocaleString() ?? 0}
              // Pass handlers from this component
              onDeleteClick={() => handleDeleteClick(item.short_url_id)}
              onCopyClick={() =>
                handleCopy(item.zimo_ws_url, item.short_url_id)
              }
              onShareClick={() => handleShare(item)}
              onShowResultClick={() => handleShowShortenedResult(item)}
              // Pass UI state
              isConfirmingDelete={deleteConfirm === item.short_url_id}
              isCopied={copiedItems.has(item.short_url_id)}
              isDeleting={isDeleting}
              // isSelected={isSelected(item)} // Aap isSelected prop use kar saktay hain agar selected item ko highlight karna ho
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default HistoryList;
