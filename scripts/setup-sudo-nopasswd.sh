#!/bin/bash
# 配置 sudo 免密脚本

set -e

USER=$(whoami)
SUDOERS_FILE="/etc/sudoers.d/${USER}-nopasswd"

echo "🔧 配置 sudo 免密..."
echo ""
echo "请选择配置级别："
echo "1) 只允许包管理命令 (apt, dpkg) - 推荐"
echo "2) 允许常用开发工具 (apt, npm, service)"
echo "3) 完全免密 (所有 sudo 命令) - 仅开发环境"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
  1)
    CONFIG="$USER ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/apt-get, /usr/bin/dpkg, /usr/bin/apt-cache"
    echo "✅ 配置：包管理命令免密"
    ;;
  2)
    CONFIG="$USER ALL=(ALL) NOPASSWD: /usr/bin/apt, /usr/bin/apt-get, /usr/bin/dpkg, /usr/bin/npm, /usr/bin/pnpm, /usr/sbin/service, /usr/bin/systemctl"
    echo "✅ 配置：开发工具免密"
    ;;
  3)
    CONFIG="$USER ALL=(ALL) NOPASSWD: ALL"
    echo "⚠️  配置：完全免密（不推荐生产环境）"
    ;;
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac

echo ""
echo "📝 将创建配置文件：$SUDOERS_FILE"
echo "内容："
echo "  $CONFIG"
echo ""
read -p "确认创建？(y/N): " confirm

if [[ $confirm != "y" && $confirm != "Y" ]]; then
  echo "❌ 已取消"
  exit 0
fi

# 创建配置文件（需要 sudo 密码）
echo "$CONFIG" | sudo tee "$SUDOERS_FILE" > /dev/null

# 设置正确的权限
sudo chmod 0440 "$SUDOERS_FILE"

# 验证语法
if sudo visudo -c -f "$SUDOERS_FILE"; then
  echo ""
  echo "✅ 配置成功！"
  echo "🧪 测试一下："
  echo "   sudo apt update"
else
  echo ""
  echo "❌ 配置文件语法错误，已删除"
  sudo rm -f "$SUDOERS_FILE"
  exit 1
fi
