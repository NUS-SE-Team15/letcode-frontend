<template>
  <div id="QuestionPosts">
    <div id="post-submit" style="padding: 8px">
      <a-textarea
        v-model="textInput"
        placeholder="Please enter your discussion post"
        allow-clear
      />
      <a-button
        type="secondary"
        style="margin: 4px 0 8px 0; float: right"
        size="small"
        @click="doSubmitPost"
      >
        <template #icon><icon-send /></template>
        <template #default>Send</template>
      </a-button>
    </div>
    <a-divider />
    <div id="posts-container">
      <a-list :scrollbar="true" :bordered="false">
        <!-- <template #header>Discussion Posts</template> -->
        <template #empty><a-empty description="No Content" /></template>
        <template #scroll-loading>No more data</template>
        <a-list-item
          v-for="(post, idx) in posts"
          :key="post"
          action-layout="vertical"
        >
          <a-list-item-meta
            :title="post.userAccount"
            :description="post.content"
          ></a-list-item-meta>
          <span class="post-time">{{ post.createTime }}</span>
          <template #actions>
            <span @click="doThumbPost(post)" style="user-select: none">
              <icon-thumb-up /> {{ post.thumbTimes }}
            </span>
            <a-popconfirm
              type="warning"
              content="Are you sure to delete this post?"
              okText="Delete"
              cancelText="Cancel"
              @ok="doDeletePost(idx)"
              v-if="isPostDeletable(post)"
            >
              <span><icon-delete /></span>
            </a-popconfirm>
          </template>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  IconSend,
  IconDelete,
  IconThumbUp,
} from "@arco-design/web-vue/es/icon";
import message from "@arco-design/web-vue/es/message";
import { useStore } from "vuex";

const store = useStore();

interface Props {
  questionId: string;
}
const props = withDefaults(defineProps<Props>(), {
  questionId: () => "",
});

const textInput = ref<string>("");
const posts = ref<Array<any>>([]);

const isPostDeletable = (post: any) => {
  const u = store.state.user?.loginUser;
  return u?.userRole === "admin" || u?.userAccount === post.userAccount;
};

const fetchQuestionPosts = () => {
  posts.value = [
    {
      userAccount: "whqwq",
      createTime: "2024-08-08 20:08:46",
      thumbTimes: 20,
      content:
        "Protect this branch from force pushing or deletion, or require status checks before merging. View documentation.",
    },
    {
      userAccount: "whqwq2",
      createTime: "2024-08-08 20:08:46",
      thumbTimes: 20,
      content:
        "Protect this branch from force pushing or deletion, or require status checks before merging. View documentation.",
    },
    {
      userAccount: "whqwq3",
      createTime: "2024-08-08 20:08:46",
      thumbTimes: 20,
      content:
        "Protect this branch from force pushing or deletion, or require status checks before merging. View documentation.",
    },
    {
      userAccount: "whqwq4",
      createTime: "2024-08-08 20:08:46",
      thumbTimes: 20,
      content:
        "Protect this branch from force pushing or deletion, or require status checks before merging. View documentation.",
    },
  ];
};

const doSubmitPost = () => {
  const u = store.state.user?.loginUser;
  if (!textInput.value || u?.userRole === "notLogin") {
    message.info("Post content is EMPTY!");
    return;
  }
  message.success("Send post successfully!");
  const newp = {
    userAccount: u.userAccount,
    createTime: new Date().getTime(),
    content: textInput.value,
  };
  posts.value?.splice(0, 0, newp);
};

const doDeletePost = (pidx: number) => {
  message.success("Post Deleted!");
  posts.value?.splice(pidx, 1);
};

const doThumbPost = (post: any) => {
  post.thumbTimes++;
};

onMounted(() => {
  fetchQuestionPosts();
});
</script>

<style>
#QuestionPosts {
  max-height: 75vh;
  overflow-y: auto;
}
.post-time {
  font-size: 12px;
  color: #999;
}
</style>
