import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface CommentProps {
  username: string,
  date: number,
}

const Comment: React.FC<CommentProps> = ({ username, date }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.date}> • {date}d ago •</Text>
      </View>
      <View style={styles.comment}>
        <Text style={styles.commentText}>
          It's kind of making me sad how many people are complaining about this. 
          Yes it was already a pretty game but remastering it won't hurt anything
        </Text>
      </View>
    </View>
  )
}

export default Comment

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