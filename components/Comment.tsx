import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface CommentProps {
  username: string;
  date?: Date; // Make date optional
  content: string;
}

const Comment: React.FC<CommentProps> = ({ username, date, content }) => {
  const formattedDate =
      date ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : 'Unknown date';

  return (
      <View style={styles.comment}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.date}> • {formattedDate} •</Text>
        </View>
        <View style={styles.comment}>
          <Text style={styles.commentText}>{content}</Text>
        </View>
      </View>
  );
};

export default Comment;


const styles = StyleSheet.create({
  username: {
    fontWeight: '500',
  },
  date: {
    color: 'grey'
  },
  comment: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  commentText: {
    fontSize: 15,
  }
})