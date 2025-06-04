import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Types ---
export interface ReviewSubmitData {
  order_no: string;
  rating: number;   // 1-5
  tags: string[];
  comment?: string;
}

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewSubmitData) => Promise<void>;
  orderNo: string;
  predefinedTags?: string[];
}

const DEFAULT_TAGS = [
  "小甜甜", "花样百出", "貌美如花",
  "气质女王", "服务到位", "服务到位",
  "人美心善", "人美心善", "人美心善",
];

const RATING_LABELS = ["非常差", "较差", "一般", "推荐", "超赞"];

export default function ReviewModal({
  isVisible,
  onClose,
  onSubmit,
  orderNo,
  predefinedTags = DEFAULT_TAGS,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setRating(0);
      setSelectedTags([]);
      setComment('');
      setIsSubmitting(false);
    }
  }, [isVisible]);

  const handleStarPress = (index: number) => {
    setRating(index + 1);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("提示", "请选择星级评分");
      return;
    }

    setIsSubmitting(true);
    const submitData: ReviewSubmitData = {
      order_no: orderNo,
      rating: rating,
      tags: selectedTags,
      comment: comment.trim() || undefined,
    };

    try {
      await onSubmit(submitData);
    } catch (error: any) {
      console.error("Error submitting review from modal:", error);
      Alert.alert("提交失败", error?.message || "无法提交评价，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableOpacity
         style={styles.modalOverlay}
         activeOpacity={1}
      >
        {/* Content Container */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{width: 24}} />
            <Text style={styles.title}>星级打标</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#AAA" />
            </TouchableOpacity>
          </View>

          {/* Star Rating */}
          <View style={styles.ratingContainer}>
            {RATING_LABELS.map((label, index) => {
              const starRating = index + 1;
              const isSelected = starRating <= rating;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.starWrapper}
                  onPress={() => handleStarPress(index)}
                >
                  <Ionicons
                    name={isSelected ? "star" : "star-outline"}
                    size={35}
                    color={isSelected ? "#34C759" : "#666"}
                  />
                  <Text style={[styles.ratingLabel, isSelected && styles.ratingLabelSelected]}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Description */}
          <Text style={styles.description}>服务太棒啦！我想夸夸</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {[...new Set(predefinedTags)].map((tag, index) => {
              const isTagSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={`${tag}-${index}`}
                  style={[
                    styles.tagButton,
                    isTagSelected && styles.tagButtonSelected
                  ]}
                  onPress={() => handleToggleTag(tag)}
                >
                  <Text style={[styles.tagText, isTagSelected && styles.tagTextSelected]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

           {/* Optional Comment Input - Uncomment if needed
           <TextInput
               style={styles.commentInput}
               placeholder="说说你的感受吧..."
               placeholderTextColor="#666"
               value={comment}
               onChangeText={setComment}
               multiline
               textAlignVertical="top"
           />
           */}

          {/* Submit Button */}
          <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
          >
             {isSubmitting
                ? <ActivityIndicator color="black" size="small" />
                : <Text style={styles.submitButtonText}>提交</Text>
             }
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 5,
  },
  starWrapper: {
    alignItems: 'center',
  },
  ratingLabel: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },
  ratingLabelSelected: {
      color: '#AAA',
  },
  description: {
    color: '#E0E0E0',
    fontSize: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 25,
  },
  tagButton: {
    backgroundColor: '#444',
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 14,
    margin: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagButtonSelected: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    borderColor: '#34C759',
  },
  tagText: {
    color: '#E0E0E0',
    fontSize: 13,
  },
  tagTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  commentInput: {
      backgroundColor: '#1C1C1E',
      color: 'white',
      width: '100%',
      minHeight: 80,
      borderRadius: 8,
      padding: 10,
      fontSize: 14,
      marginBottom: 20,
      textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#AAA',
  },
  submitButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});