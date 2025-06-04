import { useState, useEffect } from "react";
import { GetUserList, UserInfo } from "@/lib/user";
import { useAuth } from "@/context/AuthContext";

export function useUserList() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [currentCity, setCurrentCity] = useState("三亚市");
  const [currentChannel, setCurrentChannel] = useState("交友");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { user, setUser } = useAuth();

  const loadUsers = async (pageNum = 1, isRefresh = false) => {
    if (loading && !isRefresh) return;

    console.log(`loadUsers: START - page=${pageNum}, isRefresh=${isRefresh}`);
    if (isRefresh) {
      setRefreshing(true);
    } else if (pageNum > 1) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await GetUserList(pageNum);
      const newUsers = res.users || [];
      console.log(`loadUsers: Received ${newUsers.length} users.`);

      if (isRefresh) {
        setUsers(newUsers);
        setPage(1); // 刷新触发重置
      } else {
        if (newUsers.length > 0) {
          setUsers((prevUsers) => [...prevUsers, ...newUsers]);
          setPage(pageNum);
        }
      }

      const expectedPageSize = 10;
      setHasMore(newUsers.length >= expectedPageSize);
    } catch (e) {
      console.error("loadUsers error:", e);
    } finally {
      console.log(
        `loadUsers: FINALLY - page=${pageNum}, isRefresh=${isRefresh}`
      );
      setLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    console.log("refresh: Called");
    // setRefreshing(true);
    loadUsers(1, true);
  };

  const loadMore = () => {
    console.log(
      `loadMore: Called. Can load? !isLoadingMore=${!isLoadingMore}, hasMore=${hasMore}`
    );
    if (!isLoadingMore && hasMore && !loading && !refreshing) {
      console.log(`loadMore: Loading page ${page + 1}`);
      loadUsers(page + 1, false);
    }
  };

  useEffect(() => {
    console.log(
      "useEffect [currentCity, currentChannel]: Filters changed, calling refresh."
    );
    refresh(); // 当城市/频道变化时，重载数据
  }, [currentCity, currentChannel]);

  return {
    users,
    loading,
    refreshing,
    loadMore,
    refresh,
    hasMore,
    currentCity,
    setCity: setCurrentCity,
    currentChannel,
    setChannel: setCurrentChannel,
  };
}
