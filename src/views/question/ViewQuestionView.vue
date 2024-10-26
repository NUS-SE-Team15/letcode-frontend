<template>
  <div id="viewQuestionView">
    <a-row :gutter="[24, 24]">
      <!-- 左侧：题目详情（左上）和提交结果表格（左下） -->
      <a-col :md="12" :xs="24">
        <!-- 题目详情部分 -->
        <a-tabs default-active-key="question" class="mb-4">
          <a-tab-pane key="question" title="Question">
            <a-card v-if="question" :title="question.title">
              <a-descriptions
                title="JudgeCondition"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="Time Limit">
                  {{ question.judgeConfig.timeLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="Memory Limit">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}
                </a-descriptions-item>
                <a-descriptions-item label="Stack Limit">
                  {{ question.judgeConfig.stackLimit ?? 0 }}
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                  >
                    {{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
        </a-tabs>

        <!-- 提交结果表格部分 -->
        <a-table
          v-if="latestSubmission"
          :columns="columns"
          :data="[latestSubmission]"
          :pagination="false"
          class="mt-4"
        >
          <template #judgeInfo="{ record }">
            {{ formatJudgeInfo(record.judgeInfo) }}
          </template>
          <template #createTime="{ record }">
            {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
          <template #status="{ record }">
            {{ formatStatus(record.status) }}
          </template>
        </a-table>
      </a-col>

      <!-- 右侧：代码编辑器和提交按钮 -->
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline" class="mb-4">
          <a-form-item
            field="language"
            label="Language"
            style="min-width: 240px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="Choose a programming language"
            >
              <a-option>java</a-option>
              <a-option>cpp</a-option>
              <a-option>go</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
        </a-form>

        <CodeEditor
          :value="form.code as string"
          :language="form.language"
          :handle-change="changeCode"
        />

        <a-divider :size="0" />
        <a-button type="primary" style="min-width: 200px" @click="doSubmit">
          Submit
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, withDefaults } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import moment from "moment";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const formatStatus = (status: number | string) => {
  const statusMap: { [key: string]: string } = {
    "0": "Pending evaluation ",
    "1": "Evaluating ",
    "2": "Evaluation passed ",
    "3": "Evaluation failed ",
  };
  return statusMap[status] || "Unknown state";
};

const question = ref<QuestionVO>();
const latestSubmission = ref<any>(null); // 用于存储最新提交记录
const pollingInterval = ref<number | null>(null); // 存储轮询的 interval ID

const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

/**
 * 格式化 JudgeInfo，过滤掉 memory 字段
 */
const formatJudgeInfo = (judgeInfo: any) => {
  const { memory, ...filteredInfo } = judgeInfo;
  return JSON.stringify(filteredInfo, null, 2);
};

/**
 * 加载题目数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("Fail to load, " + res.message);
  }
};

/**
 * 提交代码并开始轮询
 */
const doSubmit = async () => {
  if (!question.value?.id) {
    return;
  }

  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value.id,
  });
  if (res.code === 0) {
    message.success(
      "Submitted successfully, start getting evaluation results..."
    );
    startPolling(); // 提交成功后启动轮询
  } else {
    message.error("Submit failed, " + res.message);
  }
};

/**
 * 启动轮询获取最新的提交记录
 */
const startPolling = () => {
  pollingInterval.value = setInterval(async () => {
    const res = await fetchLatestSubmission();
    if (res && res.status !== 1) {
      // 如果状态不再是“评测中”，停止轮询
      stopPolling();
      message.success(`Judgment completed: ${formatStatus(res.status)}`);
    }
  }, 3000); // 每3秒轮询一次
};

/**
 * 停止轮询
 */
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

/**
 * 获取最新的提交记录
 */
const fetchLatestSubmission = async () => {
  try {
    const res =
      await QuestionControllerService.listQuestionSubmitByPageUsingPost({
        current: 1,
        pageSize: 1,
        sortField: "createTime",
        sortOrder: "descend",
        timestamp: new Date().getTime(),
      });
    const pageData = res.data;

    latestSubmission.value = pageData.records[0]; // 更新最新提交记录
    console.log("Latest submission record: ", latestSubmission.value);
    return latestSubmission.value;
  } catch (error) {
    message.error("Failed to obtain the latest submission record.");
    console.error(error);
    return null;
  }
};

/**
 * 页面加载时请求题目数据
 */
onMounted(() => {
  loadData();
});

/**
 * 表格列配置，与历史记录的逻辑保持一致
 */
const columns = [
  {
    title: "SubmitId",
    dataIndex: "id",
  },
  {
    title: "Language",
    dataIndex: "language",
  },
  {
    title: "JudgeInfo",
    slotName: "judgeInfo",
  },
  {
    title: "CreateTime",
    slotName: "createTime",
  },
  {
    title: "Status",
    slotName: "status",
  },
];

const changeCode = (value: string) => {
  form.value.code = value;
};
</script>

<style>
#viewQuestionView {
  max-width: 1400px;
  margin: 0 auto;
}

#viewQuestionView .arco-space-horizontal .arco-space-item {
  margin-bottom: 0 !important;
}

.mt-4 {
  margin-top: 16px;
}
</style>
