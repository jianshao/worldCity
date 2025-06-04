import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import CommentModal, { Comment } from "@/components/CommentModal";
import LikeButton from "@/components/LikeButton";
import MoreOptionsModal from "@/components/MoreOptionsModal";
import Toast from "react-native-toast-message";
import { likeMoment, getMomentComments, PostComment, Post } from "@/lib/moment";
import { formatMomentTime } from "@/utils/timeFormat";

interface Props {
  post: Post;
  onComment?: (postId: number, comment: Comment) => void;
}

export default function PostCard({ post, onComment }: Props) {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // TODO: 判断当前用户是否为作者
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmitComment = (text: string) => {
    const newComment = {
      id: Date.now().toString(),
      username: "CurrentUser",
      content: text,
    };
    try {
      PostComment(post.moment.id, text).then((res) => {
        setComments([...comments, newComment]);
      });
    } catch (err) {
      console.log("提交评论失败: " + err);
    }
  };

  const renderImages = (images: string[]) => {
    if (!images || !images.length) return null;

    return (
      <View style={styles.imageGrid}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.gridImage} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: post.owner.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{post.owner.name}</Text>
          <Text style={styles.distance}>{post.owner.distance}</Text>
        </View>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setMoreVisible(true)}
        >
          <Entypo name="dots-three-vertical" size={16} color="gray" />
        </TouchableOpacity>
      </View>

      <MoreOptionsModal
        isVisible={moreVisible}
        isSelf={isOwner}
        onClose={() => setMoreVisible(false)}
        onReport={() => {
          setMoreVisible(false);
          Toast.show({
            type: "success",
            text1: "已举报该内容",
          });
        }}
        onDelete={() => {
          setMoreVisible(false);
          Toast.show({
            type: "success",
            text1: "动态已删除",
          });
        }}
      />

      <Text style={styles.contentText} numberOfLines={3}>
        {post.moment.content}
        <Text style={styles.seeMore}> See more</Text>
      </Text>

      {renderImages(post.moment.images)}

      <View style={styles.footer}>
        <Text style={styles.time}>
          {formatMomentTime(post.moment.created_at)}
        </Text>
        <View style={styles.icons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              // 先从api获取comments
              try {
                getMomentComments(post.moment.id).then((res) => {
                  setComments(res.comments);
                  setShowCommentModal(true);
                });
              } catch (err) {
                console.log("获取评论失败: " + err);
              }
            }}
          >
            <Ionicons name="chatbubble-outline" size={18} color="gray" />
          </TouchableOpacity>
          <LikeButton
            liked={post.liked}
            likeCount={post.like_count}
            onLikeToggle={async (newLiked) => {
              try {
                await likeMoment(post.owner.id, post.moment.id, newLiked);
              } catch (err) {
                console.log("点赞失败: " + err);
              }
            }}
          />
        </View>
      </View>

      <CommentModal
        visible={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        comments={comments}
        onSubmitComment={handleSubmitComment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    padding: 16,
    marginVertical: 6,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  username: { color: "#fff", fontWeight: "bold" },
  distance: { color: "gray", fontSize: 12 },
  moreBtn: { marginLeft: "auto" },

  contentText: { color: "#fff", marginVertical: 8 },
  seeMore: { color: "#4d8bff" },

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  gridImage: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 6,
    margin: 2,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: { color: "gray", fontSize: 12 },
  icons: { flexDirection: "row" },
  iconBtn: { marginLeft: 16 },
});
