<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { NModal, NButton, NSpace, NProgress, NIcon, NText, NSpin } from 'naive-ui'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { CloudDownloadOutline, CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5'

const { t } = useI18n()

const show = ref(false)
const phase = ref<'checking' | 'up-to-date' | 'available' | 'downloading' | 'ready' | 'error'>('checking')
const version = ref('')
const errorMsg = ref('')
const downloadTotal = ref(0)
const downloadReceived = ref(0)

let pendingUpdate: Awaited<ReturnType<typeof check>> | null = null

const progressPercent = computed(() => {
  if (downloadTotal.value <= 0) return 0
  return Math.round((downloadReceived.value / downloadTotal.value) * 100)
})

const downloadedMB = computed(() => (downloadReceived.value / 1048576).toFixed(1))
const totalMB = computed(() => (downloadTotal.value / 1048576).toFixed(1))

async function open() {
  show.value = true
  phase.value = 'checking'
  version.value = ''
  errorMsg.value = ''
  downloadTotal.value = 0
  downloadReceived.value = 0
  pendingUpdate = null

  try {
    const update = await check()
    if (update?.available) {
      version.value = update.version || ''
      pendingUpdate = update
      phase.value = 'available'
    } else {
      phase.value = 'up-to-date'
    }
  } catch (e) {
    errorMsg.value = String(e)
    phase.value = 'error'
  }
}

async function startDownload() {
  if (!pendingUpdate) return
  phase.value = 'downloading'
  downloadReceived.value = 0
  downloadTotal.value = 0

  try {
    await pendingUpdate.downloadAndInstall((event) => {
      if (event.event === 'Started') {
        downloadTotal.value = (event.data as { contentLength?: number }).contentLength || 0
      } else if (event.event === 'Progress') {
        downloadReceived.value += (event.data as { chunkLength: number }).chunkLength
      } else if (event.event === 'Finished') {
        downloadReceived.value = downloadTotal.value
      }
    })
    phase.value = 'ready'
  } catch (e) {
    errorMsg.value = String(e)
    phase.value = 'error'
  }
}

function handleRelaunch() {
  relaunch()
}

function close() {
  if (phase.value !== 'downloading') {
    show.value = false
  }
}

defineExpose({ open })
</script>

<template>
  <NModal
    v-model:show="show"
    :mask-closable="phase !== 'downloading'"
    :close-on-esc="phase !== 'downloading'"
    transform-origin="center"
    :closable="phase !== 'downloading'"
    @update:show="(v: boolean) => { if (!v) close() }"
  >
    <div class="update-dialog">
      <div class="update-dialog-header">
        <span class="update-dialog-title">{{ t('preferences.auto-update') }}</span>
        <button v-if="phase !== 'downloading'" class="update-dialog-close" @click="close">×</button>
      </div>
      <div class="update-dialog-body">
        <Transition name="phase-fade" mode="out-in">
          <div v-if="phase === 'checking'" key="checking" class="update-phase">
            <NSpin size="small" />
            <NText depth="2">{{ t('app.checking-for-updates') }}</NText>
          </div>

          <div v-else-if="phase === 'up-to-date'" key="up-to-date" class="update-phase">
            <NIcon :size="36" color="var(--primary-color)">
              <CheckmarkCircleOutline />
            </NIcon>
            <NText>{{ t('preferences.is-latest-version') }}</NText>
          </div>

          <div v-else-if="phase === 'available'" key="available" class="update-phase">
            <NIcon :size="36" color="var(--primary-color)">
              <CloudDownloadOutline />
            </NIcon>
            <NText style="font-size: 15px; font-weight: 600;">v{{ version }}</NText>
            <NButton type="primary" size="small" @click="startDownload">
              {{ t('preferences.update-and-install') }}
            </NButton>
          </div>

          <div v-else-if="phase === 'downloading'" key="downloading" class="update-phase">
            <NProgress
              type="line"
              :percentage="progressPercent"
              :show-indicator="true"
              indicator-placement="inside"
              processing
            />
            <NText depth="3" style="font-size: 12px;">
              {{ downloadedMB }} / {{ totalMB }} MB
            </NText>
          </div>

          <div v-else-if="phase === 'ready'" key="ready" class="update-phase">
            <NIcon :size="36" color="var(--primary-color)">
              <CheckmarkCircleOutline />
            </NIcon>
            <NText>{{ t('preferences.update-download-complete') }}</NText>
            <NButton type="primary" size="small" @click="handleRelaunch">
              {{ t('preferences.restart-now') }}
            </NButton>
          </div>

          <div v-else-if="phase === 'error'" key="error" class="update-phase">
            <NIcon :size="36" color="#e88080">
              <CloseCircleOutline />
            </NIcon>
            <NText>{{ t('preferences.check-update-failed') }}</NText>
            <NText depth="3" style="font-size: 12px; word-break: break-all;">{{ errorMsg }}</NText>
            <NSpace justify="center">
              <NButton size="small" @click="open">{{ t('app.retry') }}</NButton>
              <NButton size="small" quaternary @click="close">{{ t('app.close') }}</NButton>
            </NSpace>
          </div>
        </Transition>
      </div>
    </div>
  </NModal>
</template>

<style scoped>
.update-dialog {
  width: 380px;
  background: var(--n-color, #1e1e2e);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.update-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 0;
}
.update-dialog-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--n-text-color, #fff);
}
.update-dialog-close {
  background: none;
  border: none;
  color: var(--n-text-color, #aaa);
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.update-dialog-close:hover {
  opacity: 1;
}
.update-dialog-body {
  padding: 24px 24px 28px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.update-phase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  width: 100%;
}

.phase-fade-enter-active,
.phase-fade-leave-active {
  transition: opacity 0.25s ease;
}
.phase-fade-enter-from,
.phase-fade-leave-to {
  opacity: 0;
}
</style>
