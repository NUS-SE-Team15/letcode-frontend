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
    <a-divider margin="0" />
    <div id="posts-container">
      <a-list
        :bordered="false"
        :data="postsData"
        :pagination-props="{
          showTotal: true,
          pageSize: listPostParams.pageSize,
          current: listPostParams.current,
          total: listPostTotal,
        }"
        @page-change="onPageChange"
      >
        <!-- <template #header>Discussion Posts</template> -->
        <template #empty><a-empty description="No Content" /></template>
        <template #item="{ item }">
          <a-list-item action-layout="vertical">
            <a-list-item-meta
              :title="item.user?.userAccount"
              :description="item.content"
            ></a-list-item-meta>
            <span class="post-time">
              {{ moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") }}
            </span>
            <template #actions>
              <span @click="switchThumbPost(item)" style="user-select: none">
                <icon-thumb-up-fill v-if="item.hasThumb" />
                <icon-thumb-up v-else />
                {{ item.thumbNum }}
              </span>
              <a-popconfirm
                type="warning"
                content="Are you sure to delete this post?"
                okText="Delete"
                cancelText="Cancel"
                @ok="doDeletePost(item)"
                v-if="isPostDeletable(item)"
              >
                <span><icon-delete /></span>
              </a-popconfirm>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watchEffect, withDefaults } from "vue";
import moment from "moment";
import message from "@arco-design/web-vue/es/message";
import {
  IconSend,
  IconDelete,
  IconThumbUp,
  IconThumbUpFill,
} from "@arco-design/web-vue/es/icon";
import {
  PostVO,
  PostControllerService,
  PostThumbControllerService,
  PostQueryRequest,
} from "../../../../generated";
import { useStore } from "vuex";

const store = useStore();

// props transfer quesitonId
interface Props {
  questionId: number;
}
const props = withDefaults(defineProps<Props>(), {
  questionId: () => 0,
});

const textInput = ref<string>("");
const postsData = ref<PostVO[]>([]);

// pagination param
const listPostParams = ref<PostQueryRequest>({
  pageSize: 5,
  current: 1,
});
const listPostTotal = ref<number>(0);

// load data according to pagination param
const fetchQuestionPosts = async () => {
  const res = await PostControllerService.listPostVoByPageUsingPost(
    listPostParams.value
  );
  if (res.code === 0) {
    postsData.value = res.data.records || [];
    listPostTotal.value = Number(res.data.total);
  } else {
    message.error("load posts failed");
  }
};

// watch listPostParams update, then fetchdata
watchEffect(() => {
  fetchQuestionPosts();
});

const onPageChange = (page: number) => {
  listPostParams.value.current = page;
};

// only post owner and admin can delete
const isPostDeletable = (post: PostVO) => {
  const u = store.state.user?.loginUser;
  return u?.userRole === "admin" || u?.userAccount === post?.user?.userAccount;
};

// send a new post
const doSubmitPost = async () => {
  const u = store.state.user?.loginUser;
  if (!textInput.value || u?.userRole === "notLogin") {
    message.info("PostVO content is EMPTY!");
    return;
  }
  const res = await PostControllerService.addPostUsingPost({
    content: textInput.value,
    title: textInput.value.slice(0, 5),
    questionId: props.questionId,
    tags: [],
  });
  if (res.code === 0) {
    textInput.value = "";
    message.success("Send post successfully!");
    fetchQuestionPosts();
  } else {
    message.error("Post failed");
  }
};

const doDeletePost = async (post: PostVO) => {
  const res = await PostControllerService.deletePostUsingPost({
    id: post.id,
  });
  if (res.code === 0) {
    message.success("Post Deleted!");
    fetchQuestionPosts();
  }
};

const switchThumbPost = async (post: PostVO) => {
  // 目前只有点赞,没有取消点赞
  if (!post.hasThumb) {
    const res = await PostThumbControllerService.doThumbUsingPost({
      postId: post.id,
    });
    if (res.code === 0) {
      fetchQuestionPosts();
    }
  }
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
