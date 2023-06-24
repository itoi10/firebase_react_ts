import styles from './Feed.module.css'
import PostInput from './PostInput'

export const Feed = () => {
  return (
    <div className={styles.feed}>
      Feed
      <PostInput />
    </div>
  )
}
