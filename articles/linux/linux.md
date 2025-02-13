## 初始设置
- **下载虚拟机软件**：选择适合的虚拟机软件（如 VirtualBox 或 VMware）。
- **下载操作系统 ISO 映像文件**：选择并下载你想安装的 Linux 发行版（例如 Ubuntu、CentOS 等）的 ISO 文件。
    - **ISO 映像文件**：是包含了完整光盘内容的文件，包含引导记录、文件系统、数据文件和目录结构。
- **导入 ISO 文件到虚拟机**，并进行相关配置，如分配内存、硬盘空间等。
---

## 了解基本linux
### Linux 常见目录及其用途

Linux 系统遵循“一切皆文件”的原则，与 Windows 系统不同，它没有磁盘分区的概念，也没有文件后缀的区分。

#### 根目录 `/` (Root)

- **描述**：系统文件的起始点，是整个文件系统的根。
- **注意**：普通用户通常不会直接访问根目录，而是从个人的家目录开始。

#### 家目录

- **`/root`**：超级用户（root）的家目录。
- **`/home`**：普通用户的家目录，存放用户的个人文件。

#### 可执行命令目录

- **`/bin`**：存放系统启动和修复所需的二进制命令。
- **`/sbin`**：存放系统管理员使用的高级命令工具。

#### 关键系统文件

- **`/boot`**：包含引导加载程序和内核文件。**不要随意修改**。
- **`/dev`**：设备文件所在，代表系统中的各种硬件设备。**不要随意修改**。
- **`/etc`**：存放系统配置文件和环境变量定义。
- **`/proc`**：虚拟文件系统，提供进程和系统信息。**不要随意修改**。
- **`/sys`**：类似 `/proc`，但更专注于设备和内核参数。**不要随意修改**。

#### 库文件

- **`/lib`**：存放 32 位的共享库文件，供应用程序调用。
- **`/lib64`**：存放 64 位的共享库文件。

#### 挂载点和外部存储

- **`/media`**：用于自动挂载的设备，如 USB 驱动器。
- **`/mnt`**：用于临时挂载的设备。

#### 第三方软件

- **`/opt`**：安装第三方软件包的目录。

#### 运行时数据和服务

- **`/run`**：存放运行时数据，如 PID 文件、套接字文件等。
- **`/srv`**：存放服务数据，如 Web 服务器的内容。

#### 临时文件

- **`/tmp`**：存放临时文件，通常在系统重启时会被清除。

#### 日志和其他变动文件

- **`/var`**：存放日志文件、缓存、邮件队列等。
---
### 虚拟网络模式笔记

虚拟机网络配置的不同模式有其特点，以下是三种常见的虚拟网络模式简要介绍：

#### 模式1：仅主机模式（Host-Only Mode）

- **特点**
  - **内部通信**：虚拟机只能与宿主机之间实现通信。
  - **隔离性**：提供了一定程度的网络隔离，因为虚拟机不能直接访问外部网络。
  
- **优点**
  - **安全性高**：增加了系统的安全性。
  - **控制性强**：管理员可以完全控制网络流量。

- **缺点**
  - **联网限制**：需要额外配置才能访问互联网。
  - **复杂性增加**：增加了配置的复杂度。

#### 模式2：NAT 模式（Network Address Translation Mode）

- **特点**
  - **间接连接**：宿主机内置一个局域网，虚拟机通过宿主机的IP地址进行网络通信。
  - **简化配置**：更易于实现互联网访问。

- **优点**
  - **易于配置**：简化了网络配置过程。
  - **共享IP**：节省了IP资源。

- **缺点**
  - **端口冲突**：可能出现端口冲突问题。
  - **受限的入站连接**：需要额外配置端口转发规则。

#### 模式3：桥接模式（Bridged Mode）

- **特点**
  - **直接连接**：虚拟机被视为独立设备，拥有自己的IP地址，可以直接与其他网络设备进行通信
  - **透明性**：虚拟机像物理机器一样工作。

- **优点**
  - **直接访问**：能够轻松访问局域网和其他网络资源。
  - **简单易用**：无需复杂配置。

- **缺点**
  - **IP管理**：需要有效管理IP地址。
  - **潜在的安全风险**：需采取适当的安全措施。

#### 配置建议：

- 选择 NAT 模式，并配置适当的 IP 地址（如 `192.168.x.0` 为虚拟机指定的地址）。
- 子网掩码：`255.255.255.0`
- 网关：`192.168.6.2`（2是固定网关地址）

> **保存快照**：虚拟机配置好后，建议保存快照，以便后续恢复。
---

## 克隆操作

1. 关闭虚拟机。
2. 右键点击虚拟机，选择 **管理** -> **克隆**。
3. 配置克隆虚拟机的 IP 地址，确保分配不同的静态 IP 地址，否则会出现 IP 冲突。
---
## Linux的几种运行状态

### 运行级别简介

Linux 系统中的运行级别表示系统的不同工作状态，每个运行级别代表一个系统的配置模式，以下是常见的几种运行级别：

> **3和5常用**
#### 1. **运行级别 0** - 关机

- **描述**：完全关闭系统，切断电源。
- **用途**：关机。
- **命令**：`sudo shutdown -h now` 或 `sudo poweroff`

#### 2. **运行级别 1** - 单用户模式（维护模式）

- **描述**：系统仅允许 root 用户登录，没有网络服务。
- **用途**：系统维护，通常不启用网络连接。
- **命令**：`sudo systemctl isolate rescue.target` 或 `sudo telinit 1`

#### 3. **运行级别 2** - 多用户模式，无网络文件系统（NFS）

- **描述**：支持多个用户登录，但不启动网络文件系统。
- **用途**：多用户环境，但不支持远程文件系统。
- **命令**：`sudo telinit 2`

#### 4. **运行级别 3** - 完全多用户模式（文本界面）

- **描述**：提供完整的多用户环境，支持远程登录和网络服务，但不启用图形界面。
- **用途**：用于服务器或不需要图形界面的环境。
- **命令**：`sudo telinit 3`

#### 5. **运行级别 4** - 用户自定义运行级别

- **描述**：为用户定制的运行级别，通常与运行级别 3 类似。
- **用途**：用户自定义的设置。
- **命令**：`sudo telinit 4`

#### 6. **运行级别 5** - 图形化多用户模式（GUI）

- **描述**：启用图形化桌面环境，提供多用户支持。
- **用途**：适用于桌面用户，支持图形界面和桌面应用。
- **命令**：`sudo telinit 5`

#### 7. **运行级别 6** - 重启

- **描述**：重启系统。
- **用途**：重新启动计算机。
- **命令**：`sudo shutdown -r now` 或 `sudo reboot`

### systemd 和 目标单元（Target Units）

在使用 systemd 的系统中，运行级别被映射为目标单元（target units）。例如：

- **`poweroff.target`**：对应运行级别 0（关机）。
- **`rescue.target`**：对应运行级别 1（单用户模式）。
- **`multi-user.target`**：对应运行级别 3（多用户模式）。
- **`graphical.target`**：对应运行级别 5（图形化界面）。
- **`reboot.target`**：对应运行级别 6（重启）。
- 
---

## 相关基础命令

### 小知识
1. **`shift + z`**：保存并退出（在 Vim 中使用）。
2. **`ctrl + c`**：终止当前命令或进程。
3. **`tab`**：自动补全命令或文件路径，帮助加快输入速度。
4. **`*`**：通配符，表示匹配所有文件或目录（如 `*.txt` 匹配所有 `.txt` 文件）。
5. **`$`**：表示变量的值。例如，`$HOME` 表示当前用户的家目录。
6. **`-`**：表示上一次使用的目录。比如，`cd -` 会让你返回到上一个目录。
7. **`d`**：表示目录，在 `ls -l` 列表中可以看到它显示为 `d` 开头的项。
8. **`l`**：表示符号链接(软连接)，在 `ls -l` 列表中显示为指向其他文件或目录的链接。
9. **`|`**：管道符，将前一个命令的输出作为后一个命令的输入，常用于组合命令，如 `ps aux | grep nginx`。
10. 可以按 `↑` 和 `↓` 键浏览历史命令。
11. **`clear`**：清屏命令，清除终端中的内容。
12. - **`~`**：当前用户的家目录。例如，`cd ~` 会进入当前用户的家目录。
13. **`/`**：根目录，系统的顶级目录。
14. **`.`**：当前目录。
15. **`..`**：上级目录。

---

### 手册页结构

手册页（man page）是关于命令、系统调用、配置文件等的文档，通常遵循以下结构：

> man [命令]


- **NAME**：命令名称及简短描述
    
    - 该部分列出了命令的名称，并简要说明它的功能。例如：
        
        ```
        NAME
            ls - list directory contents
        ```
        
- **SYNOPSIS**：命令的基本语法
    
    - 该部分显示命令的基本使用格式，包括命令名、可选参数和选项。例如：
        
        ```
        SYNOPSIS
            ls [OPTION]... [FILE]...
        ```
        
- **DESCRIPTION**：对命令的详细描述
    
    - 详细解释命令的功能，如何使用它，以及它的行为。可能会包括一些注意事项。例如：
        
        ```
        DESCRIPTION
            List information about the FILEs (the current directory by default).
            Sort entries alphabetically if none of -cftuvSUX nor --sort.
        ```
        
- **OPTIONS**：可用选项及其功能
    
    - 列出命令支持的所有选项，并简要说明它们的作用。例如：
        
        ```
        OPTIONS
            -a, --all
                Do not ignore entries starting with '.'
            -l, --long
                Use a long listing format
        ```
        
- **EXAMPLES**：示例用法
    
    - 给出命令的实际示例，帮助用户理解命令如何使用。例如：
        
        ```
        EXAMPLES
            ls -l
                List directory contents in long format.
            ls -a
                List all files, including hidden files.
        ```
        
- **SEE ALSO**：相关命令或文档
    
    - 提供与当前命令相关的其他命令或文档的参考，帮助用户找到更多的资源。例如：
        
        ```
        SEE ALSO
            ls(1), stat(1), dir(1)
        ```
        

---

### 帮助命令

除了 `man` 命令外，还有一些其他方式来查看命令的帮助信息。

1. **`man`（手册页）**
    
    - `man <命令或配置文件>`：查看命令或配置文件的详细手册页。
    - 例如：查看 `ls` 命令的手册页：
        
        ```bash
        man ls
        ```
        
    - `man -k <keyword>`：搜索包含指定关键字的手册页。
        - 例如：搜索与 `copy` 相关的命令：
            
            ```bash
            man -k copy
            ```
            
2. **`<命令> --help`（命令行帮助）**
    
    - 许多 Linux 命令都支持 `--help` 选项，提供简短的帮助信息，显示命令的用法和可用选项。
    - 例如：查看 `ls` 命令的帮助：
        
        ```bash
        ls --help
        ```
        
    - 这将显示 `ls` 命令的简短说明、常用选项、用法等。
3. **`<命令> -h`（帮助选项）**
    
    - 有些命令使用 `-h` 作为帮助选项（与 `--help` 类似）。
    - 例如：查看 `ls` 命令的帮助：
        
        ```bash
        ls -h
        ```
        
4. **`info <命令>`（Info 文档）**
    
    - `info` 命令提供的帮助信息通常比 `man` 更详细，特别是对于一些复杂的命令。
    - 例如：查看 `ls` 命令的 `info` 文档：
        
        ```bash
        info ls
        ```
        
5. **`whatis <命令>`（简短的命令描述）**
    
    - `whatis` 命令提供一个简短的命令描述，适用于你只需要快速了解命令功能时。
    - 例如：查看 `ls` 命令的简短描述：
        
        ```bash
        whatis ls
        ```
        
6. **`apropos <关键字>`（命令或帮助文档搜索）**
    
    - `apropos` 命令用于查找与指定关键字相关的命令或帮助文档。
    - 例如：搜索与 `copy` 相关的命令：
        
        ```bash
        apropos copy
        ```
        

#### 小结

- `man`：最常用的帮助命令，提供详细的手册页。
- `--help` 和 `-h`：命令行工具的简短帮助信息，快速了解命令的使用方法。
- `info`：提供比 `man` 更详细的帮助文档，适合深入了解某些命令。
- `whatis` 和 `apropos`：用于快速查找命令的简短描述或相关命令。

*其实没什么用了,现在有ai*

---

### 开关机类命令

操作之前，建议使用 `sync` 命令将内存中的数据同步到磁盘，以确保数据的完整性。

#### 1. **`shutdown`（关闭系统）**

- **`shutdown -h`**：关机，`-h` 表示 halt，系统会关闭所有进程并停机。
    - 例如：立即关机：
        
        ```bash
        sudo shutdown -h now
        ```
        
- **`shutdown -r`**：重启系统，`-r` 表示 reboot，系统会重启。
    - 例如：立即重启：
        
        ```bash
        sudo shutdown -r now
        ```
        
- **`shutdown +minutes`**：设置延迟时间关机或重启，`+minutes` 表示在指定分钟后执行关机或重启。
    - 例如：5 分钟后关机：
        
        ```bash
        sudo shutdown -h +5
        ```
        
    - **`shutdown`** 命令可以让你在关机或重启前给其他用户发出警告消息。例如：
        
        ```bash
        sudo shutdown -h +5 "系统将在5分钟后关机，请保存您的工作！"
        ```
        

#### 2. **`reboot`（重启系统）**

- **`reboot`**：直接重启系统，相当于 `shutdown -r`，执行该命令后系统会重新启动。
    - 例如：
        
        ```bash
        sudo reboot
        ```
        

#### 3. **`poweroff`（关闭电源）**

- **`poweroff`**：关闭系统并切断电源，效果与 `shutdown -h now` 类似。该命令会关闭所有系统服务并最终关闭电源。
    - 例如：
        
        ```bash
        sudo poweroff
        ```
        

---

### 文件目录类命令

#### 路径概念

- **绝对路径**：从根目录 `/` 开始的路径。例如 `/home/user/docs`。
- **相对路径**：从当前工作目录开始的路径。例如 `docs` 或 `./docs`。

#### 1. **`pwd`**（显示当前工作目录的绝对路径）

- **作用**：打印当前所在的工作目录。
- 例如：
    
    ```bash
    pwd
    ```
    

#### 2. **`ls`**（列出目录内容）

- **`ls -a`**：列出所有文件，包括隐藏文件（文件名以 `.` 开头）。
- **`ls -l`**：以长格式列出文件信息，显示文件的权限、大小、创建日期等。
- 例如：
    
    ```bash
    ls -a
    ls -l
    ```
    

#### `ls -l` 输出格式：

每一行的输出信息依次表示：

1. **文件类型与权限**：例如 `-rwxr-xr-x`（表示文件类型、权限、用户权限、组权限等）
2. **链接数**：文件或目录的硬链接数量。
3. **文件属主**：文件所属的用户。
4. **文件属组**：文件所属的组。
5. **文件大小**：以字节为单位的文件大小。
6. **修改时间**：文件或目录的最后修改时间。
7. **文件名**：文件或目录的名称。

#### 3. **`cd`**（切换目录）

- **`cd 绝对路径`**：切换到指定的绝对路径。
- **`cd 相对路径`**：切换到指定的相对路径。
- **`cd ~` 或 `cd`**：回到当前用户的家目录，`~` 代表家目录。
- **`cd -`**：切换到上一个工作目录。
- **`cd ..`**：切换到当前目录的上一级目录。
- **`cd -P`**：跳转到实际物理路径（如果有符号链接的话）。
- **`cd /`**：回到系统根目录。

#### 4. **`mkdir`**（创建文件夹）

- **`mkdir 文件夹名`**：在当前目录下创建一个新的文件夹。
- **`mkdir 文件夹1/文件夹2`**：在当前目录下的 `文件夹1` 中创建 `文件夹2`。
- **`mkdir -p 文件夹1/文件夹2`**：递归创建多级目录，若父目录不存在会一并创建。

#### 5. **`rmdir`**（删除空目录）

- **`rmdir 文件夹名`**：删除指定的空目录。如果目录不为空，命令将失败。

#### 6. **`touch`**（创建文件）

- **`touch 文件名`**：创建一个空文件或修改文件的时间戳。
- 例如：
    
    ```bash
    touch a.txt
    ```
    

#### 7. **`cp`**（复制文件或目录）

- **`cp source dest`**：将 `source` 文件复制到 `dest` 位置。
- **`cp -r source_dir dest_dir`**：递归复制整个目录。
- **`\cp`**：不询问，强制覆盖同名文件。

#### 8. **`rm`**（删除文件或目录）

- **`rm 文件名`**：删除文件。
- **`rm -r 目录名`**：递归删除目录及其内容。
- **`rm -f 文件名`**：强制删除文件，不会提示确认。
- **`rm -v 文件名`**：显示删除过程中的详细信息。

#### 9. **`mv`**（移动文件或重命名）

- **`mv oldFileName newFileName`**：重命名文件或目录。
- **`mv sourceFile destinationDir`**：将文件或目录移动到指定目录。

**备注**：如果不再需要文件，最好先改名，如 `mv filename filename.bak`，避免误删除。

#### 10. **`cat`**（查看文件内容）

- **`cat 文件名`**：显示文件内容。
- **`cat -n 文件名`**：显示文件内容并带有行号。
- 例如：
    
    ```bash
    cat a.txt
    ```
    

#### 11. **`more`**（分页查看文件内容）

- **`more 文件名`**：以分页方式显示文件内容，按 `Space` 键查看下一页，按 `Enter` 键查看下一行，按 `Q` 键退出。
- **其他操作**：
    - 按 `Space` 键：显示文件的下一屏内容。
    - 按 `Enter` 键：向下翻一行。
    - 按 `B` 键：显示上一屏内容。
    - 按 `H` 键：显示帮助屏。
    - 按 `=` 键：显示当前行号。

#### 12. **`less`**（向前或向后浏览文件）

- **`less 文件名`**：与 `more` 类似，但支持向前或向后浏览。
- **查找**：
    - `/字串`：向下查找。
    - `?字串`：向上查找。
- 例如：
    
    ```bash
    less a.txt
    ```
    

#### 13. **`head`**（查看文件的前几行）

- **`head 文件名`**：查看文件的前 10 行。
- **`head -n 5 文件名`**：查看文件的前 5 行。

#### 14. **`tail`**（查看文件的后几行）

- **`tail 文件名`**：查看文件的后 10 行。
- **`tail -n 5 文件名`**：查看文件的后 5 行。
- **`tail -f 文件名`**：实时追踪文件的更新（适用于日志文件等）。

#### 15. **`echo`**（打印信息到控制台）

- **`echo hello world`**：打印 `hello world` 到控制台。
- **`echo "hello world"`**：支持多个空格。
- **`echo -e "hello\nworld"`**：支持反斜杠控制字符（如换行）。

#### 16. **重定向和追加**

- **覆盖** `>`：将输出重定向到文件，覆盖原文件内容。
    
    - 例如：
        
        ```bash
        echo "hello" > file.txt
        ```
        
- **追加** `>>`：将输出追加到文件末尾。
    
    - 例如：
        
        ```bash
        echo "world" >> file.txt
        ```
        
- **重定向输出**：
    
    - `cat file1 > file2`：将 `file1` 的内容覆盖到 `file2`。
    - `echo "content" >> file`：将内容追加到文件。

#### 17. **创建硬链接和软链接**

- **硬链接（`ln`）**：为文件创建一个新的文件名，多个文件名指向同一个文件内容。
    
    - **`ln 文件1 文件2`**：创建硬链接，`文件2` 成为指向 `文件1` 的新文件名。
    - 例如：
        
        ```bash
        ln a.txt b.txt
        ```
        
- **符号链接（软链接，`ln -s`）**：类似于 Windows 的快捷方式，指向原文件或目录的路径。
    
    - **`ln -s /path/to/original /path/to/link`**：创建符号链接。
    - 例如：
        
        ```bash
        ln -s /home/user/a.txt /home/user/b_link.txt
        ```
        

---


### 时间日期类命令

#### 1. 显示当前时间

- **`date`**：显示当前时间和日期
    
    ```bash
    date
    ```
    
    输出示例：
    
    ```
    Sat Jan 12 15:45:28 CST 2025
    ```
    
- **`date +%Y`**：只显示当前年份
    
    ```bash
    date +%Y
    ```
    
    输出示例：
    
    ```
    2025
    ```
    
- **`date +%m`**：只显示当前月份
    
    ```bash
    date +%m
    ```
    
    输出示例：
    
    ```
    01
    ```
    
- **`date +%d`**：只显示当前日期
    
    ```bash
    date +%d
    ```
    
    输出示例：
    
    ```
    12
    ```
    
- **`date "+%Y-%m-%d %H:%M:%S"`**：显示完整的年月日时分秒
    
    ```bash
    date "+%Y-%m-%d %H:%M:%S"
    ```
    
    输出示例：
    
    ```
    2025-01-12 15:45:28
    ```
    

#### 2. 日期计算

- **`date -d "1 day ago"`**：显示一天前的日期
    
    ```bash
    date -d "1 day ago"
    ```
    
    输出示例：
    
    ```
    Fri Jan 11 15:45:28 CST 2025
    ```
    
- **`date -d "-1 day"`**：显示一天前的日期（与上面相同）
    
    ```bash
    date -d "-1 day"
    ```
    
    输出示例：
    
    ```
    Fri Jan 11 15:45:28 CST 2025
    ```
    

#### 3. 自定义日期格式

- **`date "+%A"`**：显示星期几的名称
    
    ```bash
    date "+%A"
    ```
    
    输出示例：
    
    ```
    Saturday
    ```
    
- **`date "+%B"`**：显示当前月份的名称
    
    ```bash
    date "+%B"
    ```
    
    输出示例：
    
    ```
    January
    ```
    
- **`date -d "next Monday"`**：显示下一个星期一的日期
    
    ```bash
    date -d "next Monday"
    ```
    
    输出示例：
    
    ```
    Mon Jan 14 15:45:28 CST 2025
    ```
    

#### 4. 设置时间

- **`date -s "2025-01-13 10:30:00"`**：设置系统时间为指定的日期和时间
    
    ```bash
    sudo date -s "2025-01-13 10:30:00"
    ```
    
    **注意**：该命令需要超级用户权限（使用 `sudo`）。

#### 5. 将日期格式化为时间戳

- **`date +%s`**：显示当前时间的 UNIX 时间戳（自1970年1月1日以来的秒数）
    
    ```bash
    date +%s
    ```
    
    输出示例：
    
    ```
    1673522728
    ```
    

---


### 用户管理命令

#### 1. **添加新用户**

- **`useradd`**：用于添加一个新用户。
    
    ```bash
    useradd 用户名
    ```
    
    - **`useradd -g 组名 用户名`**：将新用户添加到指定的组。
    
    ```bash
    useradd -g 组名 用户名
    ```
    

#### 2. **设置用户密码**

- **`passwd`**：用于设置用户的密码。
    
    ```bash
    passwd 用户名
    ```
    
    - 提示：如果密码少于6个字符，会报错，但你是 root 用户时，再输一次就行了.

#### 3. **查看用户信息**

- **`id`**：查看指定用户的 UID、GID 以及所属于的组。
    
    ```bash
    id 用户名
    ```
    
- **查看 `/etc/passwd` 文件**：
    
    - **`cat /etc/passwd`** 或 **`vim /etc/passwd`**：可以查看所有用户的详细信息，UID 从1000开始，/home下的为创建的普通用户。
    
    ```bash
    cat /etc/passwd
    ```
    

#### 4. **切换用户**

- **`su`**：切换用户（仅获得该用户的执行权限，不能获得环境变量）。
    
    ```bash
    su 用户名
    ```
    
- **`su -`**：切换用户并获得该用户的环境变量和执行权限。
    
    ```bash
    su - 用户名
    ```
    

#### 5. **删除用户**

- **`userdel`**：删除用户，但保留用户的主目录。
    
    ```bash
    userdel 用户名
    ```
    
- **`userdel -r`**：删除用户及其主目录。
    
    ```bash
    userdel -r 用户名
    ```
    

#### 6. **查看当前登录用户信息**

- **`whoami`**：显示当前用户的名称。
    
    ```bash
    whoami
    ```
    
- **`who am i`**：显示当前登录用户的用户名。
    
    ```bash
    who am i
    ```
    

#### 7. **设置权限**

- **`sudo`**：使用 `sudo` 命令以管理员权限运行其他命令。
    
    ```bash
    sudo 命令
    ```
    
- **分发 `sudo` 权限**：
    
    - 编辑 `/etc/sudoers` 文件以分配 `sudo` 权限。
        1. 使用 `vim /etc/sudoers` 打开文件。
        2. 在 `root` 用户行下面添加指定用户的权限。例如：
            
            ```bash
            root    ALL=(ALL) ALL
            用户名  ALL=(ALL) ALL
            ```
            
        3. 若要免密码使用 `sudo` 权限，可以写成：
            
            ```bash
            用户名  ALL=(ALL) NOPASSWD: ALL
            ```
            

---

### 组管理类命令

#### 1. **新增组**

- **`groupadd`**：用于添加一个新组。
    
    ```bash
    groupadd 组名
    ```
    

#### 2. **删除组**

- **`groupdel`**：用于删除一个组。
    
    ```bash
    groupdel 组名
    ```
    

#### 3. **查看组信息**

- **查看 `/etc/group` 文件**：
    
    - **`cat /etc/group`** 或 **`vim /etc/group`**：可以查看所有组的信息。
    
    ```bash
    cat /etc/group
    ```
    

#### 4. **修改用户组**

- **`usermod`**：用于修改用户的主组。
    
    ```bash
    usermod -g 用户组 用户名
    ```
    
    - 该命令设置用户的主组（用户登录时默认所属的组）。每个用户都必须有一个主组，主组是用户的默认组。
    - **`用户组`**：指定的新主组名或组 ID（GID）。
    - **`用户名`**：需要修改的目标用户的用户名。

---

### **服务管理类命令**

#### **临时开关服务命令**

**说明**：这些命令用于临时启动、停止、重启服务，服务名后可加 `.service`（如 `nginx.service`）。

##### **CentOS 6**

1. **启动服务**：
    
    ```bash
    service 服务名 start
    ```
    
    例如：`service httpd start`
    
2. **停止服务**：
    
    ```bash
    service 服务名 stop
    ```
    
    例如：`service httpd stop`
    
3. **重启服务**：
    
    ```bash
    service 服务名 restart
    ```
    
    例如：`service httpd restart`
    
4. **查看服务状态**：
    
    ```bash
    service 服务名 status
    ```
    
    例如：`service httpd status`
    

##### **CentOS 7 及以上**

1. **启动服务**：
    
    ```bash
    systemctl start 服务名
    ```
    
    例如：`systemctl start nginx`
    
2. **停止服务**：
    
    ```bash
    systemctl stop 服务名
    ```
    
    例如：`systemctl stop nginx`
    
3. **重启服务**：
    
    ```bash
    systemctl restart 服务名
    ```
    
    例如：`systemctl restart nginx`
    
4. **查看服务状态**：
    
    ```bash
    systemctl status 服务名
    ```
    
    例如：`systemctl status nginx`
    
5. **查看当前运行的服务**：
    
    ```bash
    systemctl --type service
    ```
    

---

#### **永久开关服务自启命令**

**说明**：这些命令用于管理服务的开机自启设置。

##### **CentOS 6**

1. **开启服务自启**：
    
    ```bash
    chkconfig 服务名 on
    ```
    
    例如：`chkconfig httpd on`
    
2. **关闭服务自启**：
    
    ```bash
    chkconfig 服务名 off
    ```
    
    例如：`chkconfig httpd off`
    
3. **查看指定服务的自启状态**：
    
    ```bash
    chkconfig 服务名 --list
    ```
    
    例如：`chkconfig httpd --list`
    
4. **查看所有服务的自启配置**：
    
    ```bash
    chkconfig
    ```
    

##### **CentOS 7 及以上**

1. **开启服务自启**：
    
    ```bash
    systemctl enable 服务名
    ```
    
    例如：`systemctl enable nginx`
    
2. **关闭服务自启**：
    
    ```bash
    systemctl disable 服务名
    ```
    
    例如：`systemctl disable nginx`
    
3. **查看服务是否设置为自启**：
    
    ```bash
    systemctl is-enabled 服务名
    ```
    
    例如：`systemctl is-enabled nginx`
    
4. **列出所有服务的启动状态**：
    
    ```bash
    systemctl list-unit-files
    ```
    

---

#### **补充说明**

- **服务名后缀**：在 CentOS 7 中，大部分服务名需要加 `.service` 后缀，但如果省略 `.service`，系统会自动补全。
- **区别**：
    - 临时命令（如 `start`、`stop`）的效果只在当前运行期间有效，系统重启后不会保留。
    - 永久命令（如 `enable`、`disable`）的效果会在系统重启后继续生效。

---

### **文件权限类命令**

#### **文件权限解读**

Linux 系统中的文件权限分为 **文件类型**、**属主权限**、**属组权限**和**其他用户权限**，用 `ls -l` 命令可以查看文件的权限信息，例如：

```
-rwxr-xr--
```

**详细解读**：

1. **文件类型**：
    
    - **`-`**：普通文件。
    - **`d`**：目录。
    - **`l`**：符号链接文件（类似于 Windows 的快捷方式）。
    - **`c`**：字符设备文件。
    - **`b`**：块设备文件。
2. **权限位**：
    
    - 权限由 **三组**组成，分别表示**属主**、**属组**和**其他用户**的权限。
    - 每组有三位：`r`（读）、`w`（写）、`x`（执行）。
        - **`r`**：可读，值为 `4`。
        - **`w`**：可写，值为 `2`。
        - **`x`**：可执行，值为 `1`。
    - 如果某一权限位无对应权限，则用 `-` 表示。例如：`rwx` 表示有读写执行权限，而 `r-x` 表示只有读和执行权限，无写权限。
3. **权限位置**：
    
    ```
    [文件类型] [属主权限] [属组权限] [其他用户权限]
       -       rwx          r-x          r--
    ```
    
    - 示例：`-rw-r--r--`
        - 文件类型：普通文件（`-`）。
        - 属主权限：可读可写（`rw-`）。
        - 属组权限：可读（`r--`）。
        - 其他用户权限：可读（`r--`）。

---

#### **修改文件权限**

##### **1. 使用 `chmod` 修改权限**

`chmod` 命令用于修改文件或目录的权限。

1. **通过字母方式修改**：
    
    - `u`：表示属主（user）。
    - `g`：表示属组（group）。
    - `o`：表示其他用户（others）。
    - `a`：表示所有用户（all）。
    - 示例：
        - 给所有用户添加写权限：
            
            ```bash
            chmod a+w 文件名
            ```
            
        - 给属组去掉执行权限：
            
            ```bash
            chmod g-x 文件名
            ```
            
2. **通过数字方式修改**：
    
    - 使用权限值设置权限：
        - **`r=4`**，**`w=2`**，**`x=1`**。
        - 将权限值相加，代表组合权限。
    - 示例：
        - 设置权限为 `rwxr-xr-x`（属主：读写执行，属组：读执行，其他用户：读执行）：
            
            ```bash
            chmod 755 文件名
            ```
            
        - 设置权限为 `rw-r--r--`（属主：读写，属组和其他用户：只读）：
            
            ```bash
            chmod 644 文件名
            ```
            
3. **递归修改目录及其内容权限**：
    
    - 使用 `-R` 选项递归修改目录及其所有子目录和文件的权限。
        
        ```bash
        chmod -R 755 目录名
        ```
        

---

##### **2. 使用 `chown` 修改文件所有者**

`chown` 命令用于更改文件或目录的属主或属组。

1. **修改文件的属主**：
    
    ```bash
    chown 用户名 文件名
    ```
    
    示例：
    
    ```bash
    chown alice test.txt
    ```
    
    将 `test.txt` 的属主改为 `alice`。
    
2. **修改文件的属主和属组**：
    
    ```bash
    chown 用户名:组名 文件名
    ```
    
    示例：
    
    ```bash
    chown alice:developers test.txt
    ```
    
    将 `test.txt` 的属主改为 `alice`，属组改为 `developers`。
    
3. **递归修改目录及其内容的属主**：
    
    ```bash
    chown -R 用户名:组名 目录名
    ```
    

---

##### **3. 使用 `chgrp` 修改文件属组**

`chgrp` 命令用于更改文件或目录的属组。

1. **修改属组**：
    
    ```bash
    chgrp 组名 文件名
    ```
    
    示例：
    
    ```bash
    chgrp developers test.txt
    ```
    
    将 `test.txt` 的属组改为 `developers`。
    
2. **递归修改目录及其内容的属组**：
    
    ```bash
    chgrp -R 组名 目录名
    ```
    

---

#### **文件权限管理常用示例**

1. **查看文件权限**：
    
    ```bash
    ls -l 文件名
    ```
    
2. **将文件权限设置为仅属主可读写**：
    
    ```bash
    chmod 600 文件名
    ```
    
3. **为目录及其子目录所有用户添加执行权限**：
    
    ```bash
    chmod -R a+x 目录名
    ```
    
4. **修改文件属主为 `root`，属组为 `admin`**：
    
    ```bash
    chown root:admin 文件名
    ```
    
5. **设置属主和属组为当前用户**：
    
    ```bash
    chown $(whoami):$(whoami) 文件名
    ```
    
6. **给属组添加写权限**：
    
    ```bash
    chmod g+w 文件名
    ```
    
7. **移除其他用户的所有权限**：
    
    ```bash
    chmod o-rwx 文件名
    ```
    

---

### 搜索查找类命令

#### **1. 查看历史命令**

- **`history`**
    
    - 功能：查看当前用户的命令历史记录。
    - **搭配 `>` 保存到文件：**
        
        ```bash
        history > history.txt
        ```
        
        将命令历史记录保存到 `history.txt` 文件中。
- **`vim .bash_history`**
     
    - 功能：直接查看 `.bash_history` 文件（保存历史命令的文件）。
    - 注意：如果历史记录还未写入磁盘（如未退出终端），可能无法在 `.bash_history` 中看到。
    - 强制将内存中的历史记录写入磁盘：
        
        ```bash
        history -w
        ```
        

---

#### **2. 查找文件或者目录**

##### **`find` 命令**

- 基本语法：
    
    ```bash
    find [搜索范围] [选项] [匹配条件]
    ```
    
    - **常用选项：**
        1. **`-name`**：按照文件名查找（支持通配符 `*`）。
            
            ```bash
            find / -name "*.txt"  # 从根目录查找所有 .txt 文件
            ```
            
        2. **`-user`**：查找属于某个用户的文件。
            
            ```bash
            find /home -user username
            ```
            
        3. **`-size`**：根据文件大小查找。
            
            - `+`：大于指定大小。
            - `-`：小于指定大小。
            - 默认单位是 `k`（千字节）。
            
            ```bash
            find / -size +100k   # 查找大于 100KB 的文件
            find / -size -1M     # 查找小于 1MB 的文件
            ```
            
        4. **`-type`**：指定文件类型。
            
            - `f`：普通文件。
            - `d`：目录。
            
            ```bash
            find /home -type d -name "test*"  # 查找目录名以 test 开头的所有目录
            ```
            
        5. **`-exec`**：对查找到的文件执行操作。
            
            ```bash
            find / -name "*.log" -exec rm {} \;  # 删除所有 .log 文件
            ```
            
            `{}` 代表查找到的文件名，`\;` 表示命令结束。

---

#### **3. 过滤查找及管道符**

##### **管道符 `|`**

- **作用**：将前一个命令的输出结果作为输入传递给下一个命令处理。
- **常用示例：**
    1. **过滤包含特定关键字的文件或目录：**
        
        ```bash
        ls | grep "test"
        ```
        
        输出当前目录中包含 `test` 的文件或目录。
        
    2. **显示行号 `-n`：**
        
        ```bash
        ls | grep -n "test"
        ```
        
        输出包含 `test` 的文件或目录，并显示匹配的行号。
		
	3. **反过滤 `-v`**
		
		```Shell
		grep -v grep
		```
		

---

#### **4. 文件内部内容查找**

##### **`/` 查找关键字**

- 在 `vim` 编辑器中，可以按 `/` 然后输入关键字，进行查找：
    
    ```bash
    /关键字
    ```
    
    - 匹配的内容会高亮显示。
    - 按 `n` 跳转到下一个匹配项，按 `N` 跳转到上一个匹配项。

##### **`grep` 命令**

- **作用**：在文件内容中查找匹配的关键字。
- **基本语法：**
    
    ```bash
    grep [选项] "关键字" 文件名
    ```
    
    - **常用选项：**
        1. **`-n`**：显示匹配的行号。
            
            ```bash
            grep -n "关键字" 文件名
            ```
            
        2. **`-i`**：忽略大小写。
            
            ```bash
            grep -i "error" log.txt
            ```
            
        3. **`-r`**：递归搜索目录下所有文件。
            
            ```bash
            grep -r "TODO" /home/user/project
            ```
            
        4. **`--color`**：高亮显示匹配的关键字（很多系统默认开启）。
            
            ```bash
            grep --color "关键字" 文件名
            ```
            

---


### 压缩和解压缩命令

#### 1. **使用 `tar` 命令**

`tar` 命令是 Linux 中常用的打包工具，它可以用来创建归档文件（压缩）和解压归档文件（解压）。

- **创建压缩文件**：
    
    ```bash
    tar -czvf archive.tar.gz /path/to/directory
    ```
    
    - `-c`：创建新的归档文件
    - `-z`：使用 gzip 压缩
    - `-v`：显示压缩过程
    - `-f`：指定压缩文件的名称
    
    示例：将目录 `/home/user` 压缩成 `archive.tar.gz`
    
    ```bash
    tar -czvf archive.tar.gz /home/user
    ```
    
- **解压压缩文件**：
    
    ```bash
    tar -xzvf archive.tar.gz
    ```
    
    - `-x`：解压归档文件
    - `-z`：使用 gzip 解压
    - `-v`：显示解压过程
    - `-f`：指定解压文件的名称
    
    示例：解压 `archive.tar.gz` 文件
    
    ```bash
    tar -xzvf archive.tar.gz
    ```
    
- **仅查看压缩文件内容**：
    
    ```bash
    tar -tzvf archive.tar.gz
    ```
    
- **仅解压某个文件到当前目录**：
    
    ```bash
    tar -xzvf archive.tar.gz   -C path/to/file
    ```
    

#### 2. **使用 `gzip` 命令**

`gzip` 命令用于压缩单个文件。

- **压缩文件**：
    
    ```bash
    gzip filename
    ```
    
    该命令会将 `filename` 压缩为 `filename.gz`，并删除原文件。如果想保留原文件，可以使用 `-k` 选项：
    
    ```bash
    gzip -k filename
    ```
    
- **解压文件**：
    
    ```bash
    gzip -d filename.gz
    ```
    
    或者使用 `gunzip` 命令：
    
    ```bash
    gunzip filename.gz
    ```
    

#### 3. **使用 `gunzip` 命令**

`gunzip` 是 `gzip` 的解压命令，用于解压 `.gz` 格式的压缩文件。

- **解压 `.gz` 文件**：
    
    ```bash
    gunzip filename.gz
    ```
    
    该命令会解压 `filename.gz` 并删除原来的压缩文件，解压后的文件将是 `filename`。
    
- **保留压缩文件**： 如果你希望解压文件时保留 `.gz` 压缩文件，可以使用 `-k` 选项：
    
    ```bash
    gunzip -k filename.gz
    ```
    
    这会解压文件，但保留 `filename.gz` 文件。
    
- **解压多个文件**： 如果你有多个 `.gz` 文件，可以一次性解压它们：
    
    ```bash
    gunzip file1.gz file2.gz file3.gz
    ```
    
- **解压到指定目录**： `gunzip` 本身不支持指定目标目录，但你可以通过 `-c` 选项将解压内容输出到标准输出，并将它重定向到指定目录。例如：
    
    ```bash
    gunzip -c filename.gz > /path/to/destination/filename
    ```
    

#### 4. **使用 `zip` 和 `unzip` 命令**

`zip` 和 `unzip` 用于创建和解压 `.zip` 格式的文件。

- **压缩文件/目录**：
    
    ```bash
    zip -r archive.zip /path/to/directory_or_files
    ```
    
    - `-r`：递归压缩目录
    
    示例：将目录 `/home/user` 压缩成 `archive.zip`
    
    ```bash
    zip -r archive.zip /home/user
    ```
    
- **解压 `.zip` 文件**：
    
    ```bash
    unzip archive.zip
    ```
    
    - 如果你需要将文件解压到指定目录，可以使用：
    
    ```bash
    unzip archive.zip -d /path/to/destination
    ```
    

#### 5. **使用 `7z` 命令（7-Zip）**

`7z` 命令是 `7zip` 工具的命令行工具，支持多种格式的压缩和解压。

- **压缩文件/目录**：
    
    ```bash
    7z a archive.7z /path/to/directory_or_files
    ```
    
    - `a`：添加文件到压缩档案
    
    示例：将目录 `/home/user` 压缩成 `archive.7z`
    
    ```bash
    7z a archive.7z /home/user
    ```
    
- **解压 `.7z` 文件**：
    
    ```bash
    7z x archive.7z
    ```
    

#### 6. **使用 `xz` 命令**

`xz` 是一种高压缩比的压缩工具，常用于 Linux 系统中。

- **压缩文件**：
    
    ```bash
    xz filename
    ```
    
    该命令会将 `filename` 压缩为 `filename.xz`，并删除原文件。如果想保留原文件，可以使用 `-k` 选项：
    
    ```bash
    xz -k filename
    ```
    
- **解压文件**：
    
    ```bash
    xz -d filename.xz
    ```
    
    或者使用 `unxz` 命令：
    
    ```bash
    unxz filename.xz
    ```
    

#### 小结

- `tar`：适合打包和压缩（支持 `.tar.gz`、`.tar.bz2` 等格式）
- `gzip`：适用于压缩单个文件（通常与 `tar` 配合使用）
- `gunzip`：用于解压 `.gz` 文件
- `zip`：用于 `.zip` 文件格式，支持压缩多个文件或目录
- `7z`：高压缩比，支持多种格式
- `xz`：高压缩比，但压缩速度较慢，适合大文件

---


### 磁盘分区类命令

#### 1. **查看磁盘分区信息**

- **`lsblk`**：查看磁盘设备及其分区结构
    
    ```bash
    lsblk
    ```
    
    输出中会显示磁盘设备的挂载点、容量、分区等信息。
    
- **`fdisk -l`**：列出所有磁盘及其分区信息
    
    ```bash
    fdisk -l
    ```
    
    输出中包含磁盘的详细信息，包括设备名称、大小、分区类型等。
    
- **`df -h`**：查看文件系统磁盘使用情况
    
    ```bash
    df -h
    ```
    
    - `-h`：以人类可读的格式显示（单位为 GB、MB 等）。

#### 2. **磁盘分区**

- **进入磁盘分区工具**：
    
    ```bash
    fdisk /dev/sdX
    ```
    
    其中 `/dev/sdX` 是磁盘设备名称（如 `/dev/sda`）。可以通过 `lsblk` 或 `fdisk -l` 确定。
    
- **常用操作**：
    
    - 输入 `m` 查看帮助。
    - 输入 `p` 显示当前分区表。
    - 输入 `n` 创建新分区。
    - 输入 `d` 删除分区。
    - 输入 `t` 修改分区类型。
    - 输入 `w` 保存并退出。
    - 输入 `q` 退出不保存。

#### 3. **格式化分区**

- **格式化为指定的文件系统**：
    
    ```bash
    mkfs -t ext4 /dev/sdX1
    ```
    
    - `-t`：指定文件系统类型（如 `ext4`, `xfs`, `ntfs` 等）。
    - `/dev/sdX1` 是目标分区（如 `/dev/sda1`）。
    
    示例：格式化 `/dev/sda1` 为 `ext4` 文件系统
    
    ```bash
    mkfs -t ext4 /dev/sda1
    ```
    

#### 4. **挂载与卸载磁盘**

- **挂载分区到目录**：
    
    ```bash
    mount /dev/sdX1 /mnt
    ```
    
    示例：将 `/dev/sda1` 挂载到 `/mnt` 目录
    
    ```bash
    mount /dev/sda1 /mnt
    ```
    
- **卸载分区**：
    
    ```bash
    umount /mnt
    ```
    
    示例：卸载 `/mnt` 挂载点
    
    ```bash
    umount /mnt
    ```
    
- **查看挂载情况**：
    
    ```bash
    mount
    ```
    
    或者：
    
    ```bash
    df -h
    ```
    

#### 5. **调整磁盘分区**

- **调整分区大小**：
    
    - 使用 `resize2fs` 工具调整文件系统大小（仅支持 `ext2/ext3/ext4` 文件系统）。
    - 示例：扩展 `/dev/sda1` 的文件系统
        
        ```bash
        resize2fs /dev/sda1
        ```
        
- **检查和修复文件系统**：
    
    ```bash
    fsck /dev/sdX1
    ```
    
    - `fsck` 是文件系统检查工具，用于检测并修复文件系统错误。

#### 6. **使用 `parted` 工具**

`parted` 是更高级的分区管理工具，支持 GPT 和 MBR 分区表。

- **查看磁盘信息**：
    
    ```bash
    parted /dev/sdX print
    ```
    
- **创建新分区**：
    
    ```bash
    parted /dev/sdX mkpart primary ext4 1MiB 10GiB
    ```
    
    示例：创建一个 `ext4` 类型的主分区，从 1MiB 开始，到 10GiB 结束。
    
- **设置分区表类型**：
    
    ```bash
    parted /dev/sdX mklabel gpt
    ```
    
    - `gpt`：设置为 GPT 分区表。
    - `msdos`：设置为 MBR 分区表。

#### 7. **显示 UUID**

每个分区都有唯一的标识符（UUID），可以通过以下命令查看：

```bash
blkid
```

输出示例：

```bash
/dev/sda1: UUID="1234abcd-5678-efgh-ijkl-9876mnopqrst" TYPE="ext4"
```

#### 8. **永久挂载磁盘**

- 编辑 `/etc/fstab` 文件，添加以下内容：
    
    ```bash
    UUID=1234abcd-5678-efgh-ijkl-9876mnopqrst /mnt ext4 defaults 0 0
    ```
    
    - 替换 `UUID` 和挂载点 `/mnt` 为实际值。
    - `ext4` 为文件系统类型。
    
    添加后，可以通过以下命令立即生效：
    
    ```bash
    mount -a
    ```
    

---

#### 小结

- **查看分区信息**：`lsblk`、`fdisk -l`
- **分区工具**：`fdisk`、`parted`
- **格式化**：`mkfs`
- **挂载与卸载**：`mount`、`umount`
- **调整与检查**：`resize2fs`、`fsck`
- **永久挂载**：编辑 `/etc/fstab`



### 进程与线程类命令

#### 1. **查看进程信息**

- **`ps`**：显示当前进程状态
    
    - `ps aux`：列出所有进程的信息（不管是否在当前终端）
        
        ```bash
        ps aux
        ```
        
        - `a`：显示所有用户的进程
        - `u`：显示进程的详细信息（如用户名、CPU 使用、内存使用等）
        - `x`：显示没有控制终端的进程（即后台进程）
    - `ps -ef`：显示进程树及更多详细信息
        
        ```bash
        ps -ef
        ```
        
        - `-e`：列出所有进程
        - `-f`：显示完整格式，包括父进程（PPID）、进程启动时间等信息
- **`top`**：实时显示系统中进程的动态信息
    
    ```bash
    top
    ```
    
    - `top` 会显示 CPU、内存占用、进程状态等动态变化的信息。
    - 按 `q` 退出 `top`。
    - 在 `top` 中按 `P` 按 CPU 使用率排序，按 `M` 按内存使用排序。
- **`htop`**：一个比 `top` 更为友好的进程监视工具（需要安装）
    
    ```bash
    htop
    ```
    
    - `htop` 提供了更直观的界面和更多交互操作功能。
    - 可以按键盘的箭头键滚动查看，按 `F9` 可以终止进程。

#### 2. **查看特定进程**

- **`pgrep`**：根据进程名称查找进程的 PID
    
    ```bash
    pgrep process_name
    ```
    
    示例：查找 `nginx` 进程的 PID
    
    ```bash
    pgrep nginx
    ```
    
- **`pidof`**：获取某个程序的 PID
    
    ```bash
    pidof process_name
    ```
    
    示例：查找 `firefox` 的 PID
    
    ```bash
    pidof firefox
    ```
    

#### 3. **终止进程**

- **`kill`**：终止指定进程
    
    ```bash
    kill PID
    ```
    
    示例：终止 PID 为 `1234` 的进程
    
    ```bash
    kill 1234
    ```
    
    - 默认发送 `SIGTERM` 信号（优雅地终止进程）。
    - `kill -9 PID`：强制终止进程（发送 `SIGKILL` 信号）。
- **`killall`**：根据进程名终止进程
    
    ```bash
    killall process_name
    ```
    
    示例：终止所有 `nginx` 进程
    
    ```bash
    killall nginx
    ```
    

#### 4. **查看线程信息**

- **`ps -L`**：显示进程的线程信息
    
    ```bash
    ps -L -p PID
    ```
    
    - `-L`：显示线程信息
    - `-p`：指定进程 ID（PID）

#### 5. **进程优先级调整**

- **`nice`**：启动新进程并设置其优先级
    
    ```bash
    nice -n 10 command
    ```
    
    - `-n 10`：设置优先级为 10（负值优先级较高，正值优先级较低）。
- **`renice`**：修改已有进程的优先级
    
    ```bash
    renice -n 10 -p PID
    ```
    
    示例：修改 PID 为 `1234` 的进程优先级为 10
    
    ```bash
    renice -n 10 -p 1234
    ```
    

#### 6. **查看线程占用资源**

- **`strace`**：跟踪系统调用和信号
    
    ```bash
    strace -p PID
    ```
    
    示例：监视进程 `PID=1234` 的系统调用
    
    ```bash
    strace -p 1234
    ```
    

---

### 系统定时任务命令

#### 1. **cron**：系统定时任务

- **查看当前用户的定时任务**
    
    ```bash
    crontab -l
    ```
    
- **编辑定时任务**
    
    ```bash
    crontab -e
    ```
    
    该命令会打开当前用户的 crontab 文件，用于设置或编辑定时任务。
    
- **删除当前用户的所有定时任务**
    
    ```bash
    crontab -r
    ```
    

#### 2. **cron 表的格式**

定时任务的时间格式为：

```bash
* * * * * command
│ │ │ │ │
│ │ │ │ └─ 星期（0 - 7） 0和7代表周日
│ │ │ └─── 月（1 - 12）
│ │ └───── 日（1 - 31）
│ └─────── 时（0 - 23）
└───────── 分（0 - 59）
```

例如：

```bash
30 2 * * 1 /home/user/script.sh
```

这表示每周一凌晨 2:30 执行 `/home/user/script.sh`。

##### 特殊符号的使用：

在 cron 表的每一列中，你可以使用以下符号来表示不同的时间规则：

1. **星号（`*`）**：表示任意值（每个可能的值）。


2. **逗号（`,`）**：用来指定多个值。你可以用逗号分隔多个值，表示任务在这些值上执行。
    
    - 例如，`1,15,30,45` 表示“在第 1、15、30、45 分钟执行”。


3. **短横线（`-`）**：指定一个范围。
    
    - 例如，`1-5` 表示从第 1 天到第 5 天，或者从 1 点到 5 点等。


4. **斜杠（`/`）**：表示步长，指定间隔执行的时间。
    
    - 例如，`*/10` 表示“每隔 10 分钟执行一次”。


5. **问号（`?`）**：仅用于 `日` 和 `星期` 字段，表示没有特定的值。问号通常用在你已经在其他字段指定了具体值时，用来表示“无关的值”。
    
    - 例如，如果你在 `日` 字段指定了某一天，而不关心星期几，可以在 `星期` 字段使用 `?`。


6. **L**：表示“最后”。
    
    - 例如，`L` 在星期字段中表示“最后一天”（即每月最后一天），在日字段中表示“最后一个周几”。


7. **W**：表示“最接近指定日期的工作日”。
    
    - 例如，`15W` 表示最接近每月 15 日的工作日（即周一至周五）。


8. **#**：表示“每月的第几个星期几”。
    
    - 例如，`2#1` 表示每月的第一个周二。（在月位置写）


#### 3. **查看所有用户的 cron 定时任务**

要查看系统中所有用户的定时任务，可以查看 `/var/spool/cron/crontabs` 目录下的文件。

```bash
cat /var/spool/cron/crontabs/username
```

#### 4. **系统级定时任务**

- 系统级的定时任务文件通常位于 `/etc/crontab` 和 `/etc/cron.d/`。
- `/etc/crontab` 格式略有不同，包含了用户字段：
    
    ```bash
    * * * * * user command
    ```
    

#### 5. **at**：一次性定时任务

`at` 命令用于安排一次性任务，它不会像 cron 那样定期执行。

- **查看已安排的任务**
    
    ```bash
    atq
    ```
    
- **添加一次性任务**
    
    ```bash
    echo "command" | at 14:00
    ```
    
    示例：在今天 14:00 执行 `command`。
    
- **删除已安排的任务**
    
    ```bash
    atrm job_id
    ```
    
    其中 `job_id` 是任务的 ID，可以通过 `atq` 获取。
    

#### 6. **reboot 和 shutdown 时执行的定时任务**

- **`cron.daily`、`cron.weekly` 和 `cron.monthly`**： 系统有一些目录专门用于定期执行任务，如 `/etc/cron.daily/`、`/etc/cron.weekly/`、`/etc/cron.monthly/`。 可以将脚本放入这些目录中，系统会自动按日、周、月执行它们。

---



### VI 和 VIM 使用技巧

#### 一般模式 (Normal Mode)

1. `vi` 或 `vim 文件`：打开文件
2. `dd`：删除光标当前行
3. `dnd`：删除n行（删除当前行及其后n-1行）
4. `u`：撤销上一步操作
5. `x` / `X`：删除当前光标处的字母（`x` 删除光标后的字符，`X` 删除光标前的字符）
6. `yy`：复制光标当前行
7. `p`：粘贴（粘贴到光标后）
8. `dw`：删除一个词
9. `yw`：复制一个词
10. `gg`：移动到文件的开头
11. `G`：移动到文件的结尾
12. `数字 + G`：移动到指定的行（如 `10G` 移动到第10行）
13. `^`：移动到当前行的开头
14. `$`：移动到当前行的结尾
15. `ZZ`：保存并退出（等同于 `:wq`）

#### 编辑模式 (Insert Mode)

1. `i`：在当前光标前进入插入模式
2. `a`：在当前光标后进入插入模式
3. `o`：在当前行的下一行插入新行并进入编辑模式
4. `s`，`S`：`s` 删除当前字符并进入编辑模式，`S` 删除整行并进入编辑模式
5. `R`：进入替换模式（按下键后可以替换当前字符）
6. `Esc`：退出编辑模式，回到普通模式

#### 命令模式 (Command Mode)

1. 在一般模式下按 `:` 进入命令模式
2. `:w`：保存文件
3. `:q`：退出文件
4. `:wq`：保存并退出
5. `:q!`：强制退出，不保存修改
6. `:%s/旧内容/新内容/g`：替换文件中所有的旧内容为新内容
7. `/要查找的词`：向下查找指定词，`n` 跳到下一个，`N` 跳到上一个
8. `:noh`：取消搜索高亮显示
9. `:set nu`：显示行号
10. `:set nonu`：不显示行号

#### 修改主机名

1. `hostname`：查看当前主机名
2. `sudo vim /etc/hostname`：编辑主机名文件来修改主机名
3. 还需要修改 `/etc/hosts` 文件，确保主机名与本地 IP 地址映射正确：
    
    ```bash
    sudo vim /etc/hosts
    # 添加类似以下内容
    127.0.0.1   localhost
    127.0.1.1   新主机名
    ```
    
4. 通过 `ping 新主机名` 可以检查主机名是否正确映射到 IP 地址

#### 其他提示

- 当你直接关闭窗口时，VIM 会生成一个隐藏的交换文件（通常以 `.swp` 结尾），包含未保存的内容。你可以使用 `ls -a` 查看这些文件。
- 如果遇到交换文件问题，可以使用 `:e!` 强制重新加载文件，或者使用 `:q!` 强制退出。


---
s
## JAVA开发扩展

### 软件包与安装

#### **RPM（Red Hat Package Manager）**

1. **工具简介**  
    RPM 是 Linux 系统中常用的包管理工具，类似于 Windows 中的 `.exe` 安装程序，用于软件的安装、卸载、升级和查询。适用于基于 Red Hat 的 Linux 发行版（如 CentOS、RHEL 等）。
    
2. **RPM 包名称格式**  
    RPM 包的命名通常遵循以下格式：
    
    ```
    <package-name>-<version>-<release>.<architecture>.rpm
    ```
    
    - **package-name**：软件包名称
    - **version**：软件版本号
    - **release**：包发布版本号
    - **architecture**：适用硬件架构（如 x86_64）
3. **RPM 查询命令**
    
    - **查询所有已安装软件包**：
        
        ```bash
        rpm -qa
        ```
        
    - **查询指定包是否安装**：
        
        ```bash
        rpm -q <package-name>
        ```
        
    - **查询包详细信息**：
        
        ```bash
        rpm -qi <package-name>
        ```
        
    - **查询文件所属软件包**：
        
        ```bash
        rpm -qf <file-path>
        ```
        
    - **查询包安装路径**：
        
        ```bash
        rpm -ql <package-name>
        ```
        
4. **RPM 安装命令**  
    安装 RPM 包：
    
    ```bash
    sudo rpm -ivh <package-file>.rpm
    ```
    
    - `-i`：安装
    - `-v`：显示详细信息
    - `-h`：显示进度条
5. **RPM 卸载命令**  
    卸载软件包：
    
    ```bash
    sudo rpm -e <package-name>
    ```
    
    若忽略依赖卸载：
    
    ```bash
    sudo rpm -e --nodeps <package-name>
    ```
    
6. **RPM 更新命令**  
    更新或升级 RPM 包：
    
    ```bash
    sudo rpm -Uvh <package-file>.rpm
    ```
    
7. **RPM 验证命令**  
    验证已安装包的完整性：
    
    ```bash
    sudo rpm -V <package-name>
    ```
    

---

#### **YUM（Yellowdog Updater Modified）**

1. **工具简介**  
    YUM 是基于 RPM 的包管理工具，能自动处理依赖，简化软件安装和更新过程。
    
2. **YUM 常用命令**
    
    - 安装软件包：
        
        ```bash
        sudo yum -y install <package-name>
        ```
        
    - 更新软件包：
        
        ```bash
        sudo yum update <package-name>
        ```
        
    - 删除软件包：
        
        ```bash
        sudo yum remove <package-name>
        ```
        
    - 查询软件包：
        
        ```bash
        sudo yum list <package-name>
        ```
        
    - 搜索软件包：
        
        ```bash
        sudo yum search <package-name>
        ```
        
3. **YUM 仓库配置**  
    配置文件路径：`/etc/yum.repos.d/`  
    常见仓库：
    
    - 官方仓库
    - 第三方仓库（如 EPEL）

---

### **JDK 安装**

1. **推荐安装方式**  
    使用官方提供的 `.tar.gz` 包或自定义安装路径，避免依赖冲突。
    
    - 下载 JDK 压缩包，例如 `jdk-17.0.13_linux-x64_bin.tar.gz`。
    - 解压到指定目录：
        
        ```bash
        tar -zxvf jdk-17.0.13_linux-x64_bin.tar.gz -C /opt
        ```
        
    - 解压后，JDK 的路径为 `/opt/jdk-17`。
2. **配置环境变量**  
    创建环境变量配置文件：
    
    ```bash
    sudo vim /etc/profile.d/my_env.sh
    ```
    
    添加以下内容：
    
    ```bash
    # JAVA_HOME
    JAVA_HOME=/opt/jdk-17
    PATH=$PATH:$JAVA_HOME/bin
    ```
    
    立即生效：
    
    ```bash
    source /etc/profile.d/my_env.sh
    ```
    
3. **验证安装**  
    验证 JDK 安装是否成功：
    
    ```bash
    java -version
    ```
    
    若输出 JDK 的版本信息，则表示安装成功。
    

---

### Docker 安装与配置

#### **Docker 简介**

Docker 是一个开源的容器化平台，帮助开发者和运维工程师构建、运行、测试和部署应用程序。Docker 将应用程序及其所有依赖打包到一个独立的容器中，保证一致的运行环境。

---

#### **安装 Docker**

1. **设置阿里云镜像源**
    
    ```bash
    yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    ```
    
2. **安装 Docker 引擎**
    
    ```bash
    sudo yum -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```
    
3. **启动 Docker**
    
    ```bash
    sudo systemctl start docker
    ```
    
4. **验证安装**
    
    ```bash
    docker -v
    ```
    

---

#### **配置 Docker 国内镜像源**

1. 编辑配置文件：
    
    ```bash
    vi /etc/docker/daemon.json
    ```
    
2. 添加以下内容：
    
    ```json
    {
        "registry-mirrors": [
            "https://mirror.ccs.tencentyun.com",
            "https://hub.uuuadc.top",
            "https://docker.anyhub.us.kg",
            "https://dockerhub.jobcher.com",
            "https://dockerhub.icu",
            "https://docker.ckyl.me",
            "https://docker.awsl9527.cn",
            "https://docker.m.daocloud.io"
        ],
        "live-restore": true
    }
    ```
    
3. 重启 Docker 服务：
    
    ```bash
    systemctl daemon-reload
    service docker restart
    ```
    
4. 验证配置是否生效：
    
    ```bash
    docker info
    ```
    

---

#### **安装 Docker Compose**

1. 下载 Docker Compose 二进制文件：
    
    ```bash
    curl -L https://github.com/docker/compose/releases/download/1.28.6/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    ```
    
2. 添加执行权限：
    
    ```bash
    sudo chmod +x /usr/local/bin/docker-compose
    ```
    
3. 验证安装：
    
    ```bash
    docker-compose --version
    ```
    

---

#### **使用 Docker Compose 初始化服务**

Docker Compose 可以通过定义 `docker-compose.yml` 文件，直观地初始化服务。例如，安装 MySQL 服务：

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: mysql_container
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```

运行服务：

```bash
docker-compose up -d
```

docker正常启动的参数：

```
-d 后台运行容器；
--name 指定容器名；
-p 指定服务运行的端口（5672：应用访问端口；15672：控制台Web端口号）；
-v 映射目录或文件；
--hostname  主机名（RabbitMQ的一个重要注意事项是它根据所谓的 “节点名称” 存储数据，默认为主机名）；
-e 指定环境变量；
```

---



### **MySQL Docker 配置**

#### 1. **创建挂载目录**

为了确保 MySQL 数据能够持久化存储，我们需要在主机上创建数据目录和配置目录。这样，无论容器是否删除，数据和配置都会保留在宿主机上。

```bash
# 创建 MySQL 数据存储目录
mkdir -p /data/mysql/data

# 创建 MySQL 配置文件目录
mkdir -p /data/mysql/conf
```

#### 2. **配置 MySQL 配置文件**

我们将自定义的 MySQL 配置文件 `my.cnf` 挂载到 Docker 容器中。这样可以避免使用默认配置，同时根据实际需要调整 MySQL 参数（如字符集、存储引擎、连接数等）。

创建自定义 MySQL 配置文件：

```bash
# 编辑自定义的 my.cnf 配置文件
vim /data/mysql/conf/my.cnf
```

**my.cnf 配置示例：**

```ini
[mysqld]
# 默认存储引擎设置为 InnoDB
default-storage-engine=INNODB

# 设置 MySQL 服务端默认字符集为 utf8mb4
character-set-server=utf8mb4

# 设置 MySQL 服务端的 pid 文件路径
pid-file = /var/run/mysqld/mysqld.pid

# 设置 MySQL 服务端的 socket 路径
socket = /var/run/mysqld/mysqld.sock

# 设置 MySQL 数据文件的存储路径
datadir = /var/lib/mysql

# 禁用符号链接
symbolic-links=0

# 设置 MySQL 使用的 SQL 模式
sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

# 设置最大连接数
max_connections = 200

# MySQL 主从同步配置：设置唯一的 server-id
server-id = 3306

# 开启二进制日志
log-bin = /var/lib/mysql/mysql-bin

# 设置二进制日志格式：ROW（基于行的日志格式）
binlog_format = ROW

# 设置二进制日志文件记录的内容
binlog_row_image = FULL

# 设置二进制日志最大文件大小
max_binlog_size = 100M

# 设置过期的二进制日志自动删除时间（单位：天）
expire_logs_days = 7

[mysql]
# 客户端默认字符集
default-character-set=utf8mb4

[client]
# 客户端默认字符集
default-character-set=utf8mb4
```

#### 3. **创建 Docker Compose 配置文件**

使用 Docker Compose 来管理 MySQL 容器，确保 MySQL 容器使用我们创建的配置文件，同时进行数据的持久化存储。

创建 `docker-compose.yml` 配置文件：

```bash
# 编辑 Docker Compose 配置文件
vim /data/mysql/docker-compose.yml
```

**docker-compose.yml 配置示例：**

```yaml
version: '3'
services:
  mysql:
    image: mysql:8.0       # 使用 MySQL 8.0 镜像
    container_name: mysql  # 容器名称
    restart: always       # 容器失败自动重启
    ports:
      - "3366:3306"        # 映射本地端口 3366 到容器的 3306
    environment:
      MYSQL_ROOT_PASSWORD: 123456  # 设置 MySQL root 密码
      TZ: Asia/Shanghai            # 设置时区为上海
    volumes:
      - /data/mysql/data:/var/lib/mysql  # 持久化存储 MySQL 数据
      - /data/mysql/conf/my.cnf:/etc/mysql/mysql.conf.d/mysqld.cnf  # 挂载自定义配置文件
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci  # 设置字符集
```

#### 4. **启动 MySQL 容器**

完成上述配置后，通过 Docker Compose 启动 MySQL 容器。进入到配置目录并运行启动命令：

```bash
# 进入配置目录
cd /data/mysql

# 启动 MySQL 容器
docker-compose up -d
```

这样，MySQL 容器会在后台启动，并使用我们自定义的配置文件。

---

### **Redis Docker 配置**

#### 1. **创建挂载目录**

```bash
# 创建 Redis 数据存储目录
mkdir -p /data/redis
```

#### 2. **创建 `docker-compose.yml` 配置文件**

创建 Redis 的 Docker Compose 配置文件，并指定容器的配置文件和数据挂载路径。

```bash
# 编辑 Docker Compose 配置文件
vim /data/redis/docker-compose.yml
```

**docker-compose.yml 配置示例：**

```yaml
version: '3'
services:
  redis:
    image: redis:7.2.3
    container_name: redis
    restart: always
    ports:
      - "6399:6379"         # 映射本地端口 6399 到容器的 6379
    volumes:
      - /data/redis/redis.conf:/etc/redis/redis.conf  # 挂载自定义配置文件
      - /data/redis/data:/data                          # 持久化存储 Redis 数据
      - /data/redis/logs:/logs                          # 持久化存储 Redis 日志
    command: ["redis-server", "/etc/redis/redis.conf"]  # 使用自定义配置文件启动 Redis
```

#### 3. **创建 Redis 配置文件**

编辑 Redis 配置文件 `/data/redis/redis.conf`，并根据需要配置相关项。

```bash
# 编辑 Redis 配置文件
vim /data/redis/redis.conf
```

**redis.conf 配置示例：**

```ini
protected-mode no
port 6379
timeout 0

# RDB 配置
save 900 1
save 300 10
save 60 10000
rdbcompression yes
dbfilename dump.rdb
dir /data

# AOF 配置
appendonly yes
appendfsync everysec

# 设置 Redis 密码
requirepass 123456
```

#### 4. **启动 Redis 容器**

使用 Docker Compose 启动 Redis 容器：

```bash
# 进入配置目录
cd /data/redis

# 启动 Redis 容器
docker-compose up -d

# 如果需要强制重新构建容器
docker-compose up --force-recreate -d
```

---

### **RabbitMQ Docker 配置**

#### 1. **拉取镜像并启动容器**

```bash
# 拉取 RabbitMQ 镜像
docker pull rabbitmq

# 启动 RabbitMQ 容器
docker run -d --hostname my-rabbit --name rabbit -p 15672:15672 -p 5672:5672 rabbitmq
```

#### 2. **进入容器内部**

```bash
# 进入容器内部
docker exec -it 容器id /bin/bash
```

#### 3. **启用 RabbitMQ 管理插件**

```bash
# 启用 RabbitMQ 管理插件
rabbitmq-plugins enable rabbitmq_management
```

#### 4. **解决 RabbitMQ 升级警告**

在 RabbitMQ 管理界面，进入 Admin 页面，启用所有的 "Feature Flags"。

#### 5. **解决不显示图表问题**

```bash
# 进入容器内部
docker exec -it 容器id /bin/bash

# 进入配置目录
cd /etc/rabbitmq/conf.d/

# 修改配置
echo management_agent.disable_metrics_collector = false > management_agent.disable_metrics_collector.conf

# 退出容器
exit

# 重启容器
docker restart 容器id
```

#### 6. **修改 RabbitMQ 用户密码**

```bash
# 进入容器内部
docker exec -it 容器id /bin/bash

# 查看用户表
rabbitmqctl list_users

# 修改密码
rabbitmqctl change_password 用户名 '[密码]'
```

---

### Minio Docker配置


#### 1. 创建挂载目录

首先创建挂载目录来存储 Minio 数据和配置：

```bash
mkdir -p /data/minio
```

#### 2. 创建 `docker-compose.yml` 配置文件

在 `/data/minio/` 目录下创建 `docker-compose.yml` 配置文件，内容如下：

```yaml
version: '3'

services:
  minio:
    image: "minio/minio"
    container_name: minio
    ports:
      - "9000:9000"  # Minio API 端口
      - "9001:9001"  # Minio 控制台端口
    environment:
      MINIO_ROOT_USER: admin  # 管理后台用户名
      MINIO_ROOT_PASSWORD: 12345678  # 管理后台密码，至少8个字符
      MINIO_COMPRESS: "off"  # 开启压缩 "on" 或 "off"
      MINIO_COMPRESS_EXTENSIONS: ""  # 需要压缩的扩展名 (例如 .pdf,.doc)，为空表示所有文件类型均压缩
      MINIO_COMPRESS_MIME_TYPES: ""  # 需要压缩的 MIME 类型 (例如 application/pdf)，为空表示所有 MIME 类型均压缩
    volumes:
      - /data/minio/data:/data/  # 映射数据目录
      - /data/minio/config:/root/.minio/  # 映射配置目录
    command: server --address ':9000' --console-address ':9001' /data  # 启动 Minio，指定容器中的数据目录
    privileged: true
```

#### 3. 启动 Minio 容器

进入到 `/data/minio/` 目录，执行以下命令来启动 Minio 容器：

```bash
cd /data/minio
docker-compose up -d  # 启动容器
```

如果需要强制重新构建容器：

```bash
docker-compose up --force-recreate -d  # 强制重建容器
```

### 4. 配置 Minio 访问权限和 Bucket 策略

在 Minio 中配置 Bucket 权限。以下是一个示例 JSON 策略，允许所有用户访问 `blog` Bucket 中的内容：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": [ "*" ] },
      "Action": [ "s3:GetBucketLocation" ],
      "Resource": [ "arn:aws:s3:::blog" ]
    },
    {
      "Effect": "Allow",
      "Principal": { "AWS": [ "*" ] },
      "Action": [ "s3:ListBucket" ],
      "Resource": [ "arn:aws:s3:::blog" ],
      "Condition": {
        "StringEquals": { "s3:prefix": [ "*" ] }
      }
    },
    {
      "Effect": "Allow",
      "Principal": { "AWS": [ "*" ] },
      "Action": [ "s3:GetObject" ],
      "Resource": [ "arn:aws:s3:::blog/**" ]
    }
  ]
}
```

这个权限策略允许所有用户获取 `blog` Bucket 的位置、列出该 Bucket 的内容，并读取其中的对象。

#### 5. 创建 Minio 密钥

登录到 Minio 控制台 (`http://<your-minio-server-ip>:9001`)，使用管理员账号 (`admin/12345678`) 登录，创建新的 Access Key 和 Secret Key，以便用于应用程序访问 Minio 服务。



---


## 大数据扩展

### Shell 概述

#### 1. **Shell 是什么？**

- **定义**：Shell 是命令行解释器，用户通过它向操作系统发送命令，Shell 会将命令传递给操作系统内核执行，再将结果返回给用户。
- **功能**：Shell 不仅是命令行工具，还具有编程语言的功能，支持脚本编写、调试，灵活性强，可以用于自动化任务和系统管理。

#### 2. **Shell 与操作系统的关系**

- Shell 作为中介，负责将用户命令传递给操作系统内核。内核执行后将结果返回到 Shell，再展示给用户。Shell 在用户和操作系统之间充当桥梁角色。

#### 3. **常见 Shell 类型**

- **bash**（Bourne Again Shell）：最常用的 Shell，功能强大，支持命令补全、历史记录、脚本调试等。
- **sh**（Bourne Shell）：经典的 Shell，功能较简单，广泛用于 Unix 系统。
- **zsh**（Z Shell）：功能更强大，支持智能补全、主题自定义等，适合高级用户。
- **csh**（C Shell）：具有类似 C 语言的语法，适用于某些特定的任务。

#### 4. **查看系统中的 Shell**

- 使用 `cat /etc/shells` 命令查看系统中可用的 Shell 解释器。

#### 5. **bash 和 sh 的关系**

- **bash** 是 **sh** 的增强版，提供了更多功能，如命令补全和脚本调试等。
- `sh` 通常是一个软连接，指向 `bash` 或其他 Shell。可以使用 `ls -l /bin/sh` 命令查看 `sh` 是否指向 `bash`。

#### 6. **CentOS 默认 Shell**

- 在 CentOS 等 Linux 发行版中，默认的 Shell 解释器是 **bash**。

---

### Shell 脚本

#### 1. **Shell 脚本执行方法**

在脚本文件的开头加入 `#!/bin/bash`，这是约定俗成的标准，用来指定脚本使用的解释器。

- **第一种方法**： 通过 `bash 文件名` 或 `sh 文件名` 来执行脚本。
	
- **第二种方法**：给脚本文件添加可执行权限 `chmod +x 文件名`，然后通过相对路径或绝对路径直接执行脚本。
    
- **第三种方法**：使用 `source 文件名` 或 `. 文件名` 来执行脚本，这种方式无需可执行权限，且脚本会在当前 Shell 环境中执行，能继承脚本中的变量。
    

#### 2. **环境变量**

- 在脚本中定义变量，例如 `A=5`，并通过 `echo $A` 来输出变量值。
- 如果通过 `source` 或 `.` 执行脚本，脚本中的变量将被继承到当前的 Shell 环境中。否则，如果直接执行脚本，变量只在子 Shell 中有效，脚本执行完毕后变量失效。

#### 3. **`source` 和 `.` 的区别**

- 使用 `source` 或 `.` 执行脚本时，脚本内容会在当前 Shell 中执行，并且会影响当前 Shell 的环境（例如变量、函数等）。这种方法适用于需要在当前 Shell 环境中修改或继承脚本中的变量和设置。
    
- 直接执行脚本（如 `bash 文件名`）会在子 Shell 中执行脚本，脚本结束后，子 Shell 会退出，所有修改的环境变量等都会丢失。
    

---


### 变量

- **常用系统变量**：通常全大写，如 `$HOME`（用户的家目录）、`$PWD`（当前工作目录）、`$SHELL`（当前 Shell 类型）、`$USER`（当前用户）等。
    
- **显示当前 Shell 所有变量**：使用 `set` 命令。
    
- **自定义变量**：
    
    - 变量名 = 变量值（等号前后不能有空格）。
    - 使用 `unset 变量名` 来撤销变量。
- **声明静态变量**：
	使用 `readonly 变量名=变量值` 来声明只读变量，该变量无法被 `unset`。只读变量仅在当前窗口有效，重新打开一个窗口时，它不再存在。
    
- **变量名规则**：
	变量名可以由字母、数字和下划线组成，环境变量建议使用大写字母，且不能以数字开头。
    
- **字符串和数值运算**：
    
    - 在 Bash 中，变量默认是字符串类型，无法直接进行数值运算。如果有空格，需使用双引号或单引号来括起来，避免报错。例如 `"I am"`。
    - 单引号是纯粹的字符串，而双引号会解析其中的变量。
- **提升为全局环境变量**：使用 `export 变量名` 将变量提升为全局环境变量，供其他 Shell 程序使用。
    
- **示例**：创建脚本 `a.sh`
    
    ```bash
    #!/bin/bash
    echo $VAR
    ```
	外面要`export VAR=5`

#### 特殊变量

- **$n**（n 为数字）：`$0` 表示脚本名称，`$1` 到 `$9` 表示脚本传入的参数，第 10 个及以上的参数需要用 `${n}` 包裹。
    
- **传参执行脚本**：例如，执行 `./a.sh aaa "cac a" a`，其中 `$1 = aaa`，`$2 = cac a`，`$3 = a`。
    
- **$#**：获取传入脚本的参数个数。
    
- **$***：表示所有的参数，将所有参数当作一个整体。
    
- **$@**：表示所有的参数，但每个参数会被单独区分。
    
- **$?**：表示上一个命令的退出状态码，`0` 表示命令正常执行，非 `0` 表示异常。
    

---

### **Shell 运算符与条件判断**

#### **1. Shell 运算符**

在 Shell 脚本中，常用的运算符有以下几种：

##### **1.1 算术运算符**

Shell 支持两种语法来进行算术运算：

- **$((运算式))**：用于执行算术运算，支持加、减、乘、除、取余等运算符。
- **$[运算式]**：与 `((运算式))` 功能相同，但较为旧式，现在推荐使用 `((运算式))`。

**示例**：

```bash
# 使用 $(( )) 进行算术运算
result=$((3 + 5))
echo $result  # 输出 8

# 使用 $[ ] 进行算术运算
result=$[3 + 5]
echo $result  # 输出 8
```

##### **注意事项**：

- 运算符两边需要有空格。
- 变量在运算前需要赋值，否则可能会导致错误。

#### **2. Shell 条件判断**

在 Shell 中，使用条件判断来执行不同的代码块。常见的条件判断语法包括：

##### **2.1 基本语法**

- **test condition**
    
    用于测试条件是否为真，条件成立时返回 0。
    
    ```bash
    test condition
    ```
    
- **[ condition ]**
    
    与 `test` 相同，通常使用 `[]` 来进行条件判断，`[]` 前后需要有空格。
    
    ```bash
    [ condition ]
    ```
    

##### **2.2 常用判断条件**

##### **2.2.1 比较两个整数**

- `-eq`：等于（equal）
- `-ne`：不等于（not equal）
- `-lt`：小于（less than）
- `-le`：小于等于（less equal）
- `-gt`：大于（greater than）
- `-ge`：大于等于（greater equal）

**示例**：

```bash
[ 23 -ge 22 ]  # 判断 23 是否大于等于 22
echo $?  # 输出 0 表示为真，1 表示为假
```

##### **2.2.2 文件权限判断**

- `-r`：文件可读（read）
- `-w`：文件可写（write）
- `-x`：文件可执行（execute）

**示例**：

```bash
[ -x 1.txt ]  # 判断文件 1.txt 是否有执行权限
echo $?  # 输出 0 表示为真，1 表示为假
```

##### **2.2.3 文件类型判断**

- `-e`：文件是否存在（existence）
- `-f`：是否为普通文件（file）
- `-d`：是否为目录（directory）

**示例**：

```bash
[ -e 1.txt ]  # 判断文件 1.txt 是否存在
echo $?  # 输出 0 表示为真，1 表示为假
```

#### **3. `if` 判断**

`if` 用于根据条件判断执行不同的语句。

##### **3.1 单分支 `if` 判断**

```bash
if [ condition ]; then
    # 执行语句
fi
```

##### **3.2 多分支 `if` 判断（`elif`）**

```bash
if [ condition1 ]; then
    # 执行语句1
elif [ condition2 ]; then
    # 执行语句2
else
    # 执行语句3
fi
```

**示例**：

```bash
if [ -f "file.txt" ]; then
  echo "file.txt 是一个普通文件"
elif [ -d "file.txt" ]; then
  echo "file.txt 是一个目录"
else
  echo "file.txt 不存在"
fi
```

#### **4. `case` 判断**

`case` 用于多分支判断，比 `if` 更简洁，适用于多种情况的判断。

##### **语法**：

```bash
case "$variable" in
  pattern1)
    # 执行语句1
    ;;
  pattern2)
    # 执行语句2
    ;;
  *)
    # 默认执行语句
    ;;
esac
```

**示例**：

```bash
case "$1" in
  start)
    echo "启动程序"
    ;;
  stop)
    echo "停止程序"
    ;;
  restart)
    echo "重启程序"
    ;;
  *)
    echo "无效命令"
    ;;
esac
```

---

### **Shell 循环使用**

#### **1. `for` 循环**

`for` 循环用于固定次数的迭代，通常用来遍历一组元素或执行某些任务一定次数。

##### **语法**：

```bash
for var in list
do
    # 执行语句
done
```

- `var`：循环变量，每次迭代时取 `list` 中的一个值。
- `list`：可以是数值范围、文件名列表或其他集合。

##### **示例 1：使用数值范围**

```bash
for i in {1..5}
do
    echo "第 $i 次循环"
done
```

##### **示例 2：遍历文件名列表**

```bash
for file in *.txt
do
    echo "文件名：$file"
done
```

该示例遍历当前目录下所有 `.txt` 文件，并打印每个文件的名字。

##### **示例 3：遍历字符串列表**

```bash
for color in red green blue
do
    echo "颜色是：$color"
done
```

##### **示例 4：使用数组**

```bash
colors=("red" "green" "blue")
for color in "${colors[@]}"
do
    echo "颜色是：$color"
done
```

#### **2. `while` 循环**

`while` 循环用于在给定的条件为真时重复执行某个命令或语句，直到条件为假时停止。

##### **语法**：

```bash
while [ condition ]
do
    # 执行语句
done
```

- `condition`：条件表达式，若为真（返回值为0）则执行循环体，否则退出循环。

##### **示例 1：简单的计数循环**

```bash
i=1
while [ $i -le 5 ]
do
    echo "第 $i 次循环"
    ((i++))  # i自增1
done
```

##### **示例 2：用户输入判断**

```bash
echo "请输入一个数字（输入0退出）："
while read num
do
    if [ $num -eq 0 ]; then
        echo "退出程序"
        break
    fi
    echo "你输入的是：$num"
    echo "请输入一个数字（输入0退出）："
done
```

该示例会反复提示用户输入数字，直到输入 `0` 为止。

##### **示例 3：无限循环**

```bash
while true
do
    echo "这将一直输出，直到手动终止"
done
```

该循环会无限执行，直到你手动中断（例如使用 `Ctrl+C`）。

#### **3. `for` 循环中的 `(( ))` 语法（算术操作）**

`for` 循环不仅支持列表迭代，还可以结合 `(( ))` 进行算术运算，用于处理数值的增加、减少等。

##### **语法**：

```bash
for ((i=初始值; i<=终止值; i++))
do
    # 执行语句
done
```

##### **示例 1：递增计数**

```bash
for ((i=1; i<=5; i++))
do
    echo "第 $i 次循环"
done
```

---

### ** Shell `read` 命令基本语法**

`read` 命令用于从标准输入读取用户输入的内容，并将其保存到指定的变量中。

##### **语法**：

```bash
read [选项] [变量]
```

- `-p`：指定提示信息，显示在用户输入前。
- `-t`：指定读取输入的超时时间（单位：秒），超时后不再等待输入。

#### **脚本示例：**

```bash
#!/bin/bash
read -t 7 -p "Enter your name in 7 seconds: " NAME
echo $NAME
```

- `#!/bin/bash`：指定脚本的解释器为 Bash。
- `read -t 7 -p "Enter your name in 7 seconds: "`：提示用户输入姓名，给出 7 秒的时间限制。
- `NAME`：用户输入的内容将存储在 `NAME` 变量中。
- `echo $NAME`：输出用户输入的姓名。

##### **说明**：

- `-t 7`：给用户 7 秒的时间输入姓名。
- `-p`：提供输入提示信息 `"Enter your name in 7 seconds: "`。
- 如果 7 秒内用户没有输入，`NAME` 变量将为空，脚本会继续执行并输出空字符串。

---


### ** Shell系统函数**


`basename` 命令用于从指定路径中去掉路径的前缀部分，只保留文件名或目录名。如果指定了后缀，`basename` 会从文件名中去除该后缀。

#### **基本语法**：

```bash
basename [string / pathname] [suffix]
```

- `string / pathname`：指定的路径或字符串。
- `suffix`：可选参数，用于去除文件名的后缀部分。如果指定了 `suffix`，`basename` 会去除 `string` 或 `pathname` 的后缀。

#### **功能描述**：

- `basename` 会删除路径中的前缀部分（直到最后一个 `/`），返回路径中的文件名。
- 如果指定了 `suffix`，`basename` 会去除文件名中的指定后缀。

#### **示例**：

1. **获取文件名**：
    
    ```bash
    [atguigu@hadoop101 datas]$ basename /home/atguigu/banzhang.txt
    banzhang.txt
    ```
    
2. **去除文件后缀**： 如果指定了 `.txt` 后缀，`basename` 会去掉它：
    
    ```bash
    [atguigu@hadoop101 datas]$ basename /home/atguigu/banzhang.txt .txt
    banzhang
    ```
    

#### **补充说明**：

- 如果路径以 `/` 结尾，`basename` 会去掉该 `/`。
- `basename` 常用于提取文件名而不包括路径部分，尤其在脚本中处理文件路径时非常有用。

---


`dirname` 命令用于从指定路径中去掉文件名部分，返回路径中的目录部分。

#### **基本语法**：

```bash
dirname pathname
```

- `pathname`：指定的完整路径。

#### **功能描述**：

- `dirname` 会去掉路径中的文件名部分，只保留路径中的目录部分。

#### **示例**：

1. **获取文件路径**：
    
    ```bash
    [atguigu@hadoop101 datas]$ dirname /home/atguigu/banzhang.txt
    /home/atguigu
    ```
    

#### **补充说明**：

- `dirname` 是用于提取路径的目录部分，常与 `basename` 搭配使用，用于提取文件名和路径。

---



### **Shell 自定义函数**

#### **1. 基本语法**

```bash
[function] funname() {
    # 执行的操作
    [return int]
}
```

- `function`（可选）：你可以选择是否使用 `function` 关键字来定义函数，实际效果相同。
- `funname`：自定义的函数名称。
- `{}`：函数体，包含一系列的操作或命令。
- `[return int]`（可选）：函数的返回值。返回值通常是一个整数，表示函数的执行结果。

#### **2. 经验技巧**

1. **函数定义顺序**：在调用函数之前，必须先定义函数。Shell 脚本是逐行执行的，和其他编程语言不同，它不会提前进行编译。因此，函数必须在调用之前被定义。
    
2. **返回值**：函数只能返回一个整数值，通常是通过 `return` 关键字返回。返回值的范围通常是 `0-255`，其中 `0` 表示成功，其他值表示不同的错误或状态。
    
    - **返回值 0**：通常表示成功。
    - **返回值非 0**：表示函数执行失败或出现某种错误。

#### **3. 示例实现**

计算两个输入参数的和，并返回结果。

```bash
#!/bin/bash

# 定义一个函数，计算两个数字的和
add_numbers() {
    local sum=$(( $1 + $2 ))
    return $sum  # 返回计算结果
}

# 调用函数并传递两个参数
add_numbers 5 3

# 获取函数的返回值
result=$?
echo "The sum is: $result"
```

- **函数定义**：`add_numbers` 函数计算两个数字的和。
- **调用函数**：`add_numbers 5 3`，传递参数 `5` 和 `3`。
- **获取返回值**：使用 `$?` 获取函数的返回值，这里返回的是 `sum` 的值。

**说明**：

- `local` 用于局部变量，保证该变量只在函数内有效，避免影响外部变量。
- `return` 只能返回整数值，通常用来表示操作的状态或者返回计算结果。

#### **4. 使用 `echo` 输出结果**

如果需要返回更复杂的结果，可以使用 `echo` 输出，而不是使用 `return`。例如：

```bash
#!/bin/bash

# 定义函数，返回一个字符串
greet_user() {
    echo "Hello, $1!"
}

# 调用函数并获取输出
greeting=$(greet_user "Alice")
echo $greeting
```

在这个示例中，`greet_user` 函数输出一个问候语，调用时将其结果存储在 `greeting` 变量中。

---

### **Shell 工具


### **1 cut 命令**

#### **介绍**

`cut` 命令用于从文件中提取某些列、字节或者字符。常用于处理格式良好的数据，如 CSV 文件、日志文件等。

#### **基本语法**

```bash
cut [选项参数] filename
```

#### **选项说明**

|选项|功能|
|---|---|
|`-f`|指定要提取的字段（列）。|
|`-d`|指定字段的分隔符（默认是制表符）。|
|`-c`|按字符位置切割，指定字符的范围。|

#### **常见示例**

1. **按空格分隔提取字段**
    
    - 提取第一列：
        
        ```bash
        cut -d ' ' -f 1 cut.txt
        ```
        
        输出：`dong`
        
    - 提取第二列：
        
        ```bash
        cut -d ' ' -f 2 cut.txt
        ```
        
        输出：`shen`
        
2. **按字符提取**
    
    - 提取第一个字符：
        
        ```bash
        cut -c 1 cut.txt
        ```
        
        输出：`d`
        
    - 提取第一个到第三个字符：
        
        ```bash
        cut -c 1-3 cut.txt
        ```
        
        输出：`don`
        
3. **提取系统 PATH 环境变量中的路径**
    
    ```bash
    echo $PATH | cut -d ":" -f 3-
    ```
    
    输出：  
    `/usr/local/sbin:/usr/sbin:/home/atguigu/.local/bin:/home/atguigu/bin`
    

---

### **2 awk 命令**

#### **介绍**

`awk` 是一个强大的文本处理工具，可以用于模式扫描和数据处理。

#### **基本语法**

```bash
awk [选项参数] '/pattern/{action}' filename
```

#### **选项说明**

|选项|功能|
|---|---|
|`-F`|指定输入文件的分隔符。|
|`-v`|定义外部变量。|

#### **内置变量**

|变量|说明|
|---|---|
|`FILENAME`|当前文件名。|
|`NR`|已读取的行号。|
|`NF`|当前行的字段数。|

#### **常见示例**

1. **统计字段数**
    
    ```bash
    awk -F : '{print $1, NF}' passwd
    ```
    
    输出：
    
    ```
    root 7  
    daemon 7  
    bin 7  
    sys 7
    ```
    
2. **查找空行并打印行号**
    
    ```bash
    awk '/^$/ {print NR}' ifconfig
    ```
    
    输出：
    
    ```
    9  
    18  
    26
    ```
    
3. **使用 `-v` 选项传递变量**
    
    ```bash
    awk -F : -v user="root" '$1 == user {print $1, $7}' passwd
    ```
    
    输出：
    
    ```
    root /bin/bash
    ```
    

---

### **3 wc 命令**

#### **功能**

`wc` 用于统计文件的行数、单词数、字节数、字符数等。

#### **基本语法**

```bash
wc [选项] 文件名
```

#### **选项说明**

|选项|功能|
|---|---|
|`-l`|统计行数|
|`-w`|统计单词数|
|`-m`|统计字符数|
|`-c`|统计字节数|

#### **常见示例**

1. **统计行数、单词数、字符数**
    
    ```bash
    wc -l /etc/profile   # 行数
    wc -w /etc/profile   # 单词数
    wc -m /etc/profile   # 字符数
    ```
    
2. **组合使用选项**
    
    ```bash
    wc -lwc /etc/profile
    ```
    
3. **统计多个文件**
    
    ```bash
    wc -lw file1.txt file2.txt
    ```
    

---

### **4 sort 命令**

#### **基本语法**

```bash
sort [选项] 文件列表
```

#### **常用选项说明**

|选项|功能描述|
|---|---|
|`-n`|按数值大小排序|
|`-r`|反向排序（降序）|
|`-t`|指定字段分隔符（默认制表符）|
|`-k`|指定排序的关键列（字段位置）|

#### **实战案例**

1. **按数值降序排序**
    
    ```bash
    sort -t : -nrk 2 sort.txt
    ```
    
    输出：
    
    ```
    xz:50:2.3
    bb:40:5.4
    bd:20:4.2
    cls:10:3.5
    ```
    
2. **多列排序**
    
    ```bash
    sort -k 2,3 sort.txt
    ```
    
3. **去重排序**
    
    ```bash
    sort -u sort.txt
    ```
    
4. **混合排序**
    
    ```bash
    sort -k 2n -k 3r sort.txt
    ```
    

---



#  Shell 正则表达式

## 一、基础概念
**正则表达式(Regular Expression)**  
通过特定语法规则构成的字符序列，主要用于：
- 文本模式匹配
- 字符串检索
- 数据替换
- 复杂格式验证

**Linux三剑客支持**：

grep   # 文本搜索
sed    # 流编辑器
awk    # 文本分析


---

## 二、匹配模式详解

### 1. 常规匹配（Literal Matching）

grep 'atguigu' /etc/passwd  # 匹配包含"atguigu"的整行


### 2. 锚点字符
| 字符 | 功能         | 示例               |
|------|--------------|--------------------|
| `^`  | 匹配行首     | `grep '^a' file`   |
| `$`  | 匹配行尾     | `grep 't$' file`   |
| `^$` | 匹配空行     | `grep '^$' file`   |

### 3. 通配符扩展

| 元字符 | 功能                      | 示例                    |
|--------|---------------------------|-------------------------|
| `.`    | 匹配任意单个字符          | `grep 'a.c' file`       |
| `*`    | 前导字符出现0次或多次     | `grep 'ab*c' file`      |
| `+`    | 前导字符出现1次或多次     | `grep -E 'ab+c' file`   |
| `?`    | 前导字符出现0次或1次      | `grep -E 'ab?c' file`   |
| `{n}`  | 精确匹配n次               | `grep -E 'a{3}' file`   |
| `{n,m}`| 匹配n到m次                | `grep -E 'a{2,4}' file` |
| `{n,}` | 匹配至少n次               | `grep -E 'a{3,}' file`  |

### 4. 字符集合
| 表达式       | 功能                      | 示例                      |
|--------------|---------------------------|--------------------------|
| `[abc]`      | 匹配集合内任意字符        | `grep '[AT]om' file`     |
| `[^abc]`     | 排除集合内字符            | `grep '[^0-9]' file`     |
| `[a-z]`      | 匹配字符范围              | `grep '[A-Za-z]' file`   |
| `\d`         | 数字字符（需`-E`扩展）    | `grep -E '\d+' file`     |

### 5. 分组与转义
| 表达式       | 功能                      | 示例                      |
|--------------|---------------------------|--------------------------|
| `()`         | 捕获分组                  | `grep -E '(ab)+' file`   |
| `\`          | 转义特殊字符              | `grep '\.com' file`      |
| `\|`         | 逻辑或（需`-E`扩展）      | `grep -E 'cat\|dog' file`|

---

## 三、高级特性

### 1. 非贪婪匹配
```bash
# 贪婪匹配（匹配最长内容）
grep -P '<.*>' file

# 非贪婪匹配（匹配最短内容）
grep -P '<.*?>' file
```

### 2. 捕获组与反向引用
```bash
# 捕获重复出现的模式
grep -P '(\w+)\s+\1' file  # 匹配连续重复的单词（如"the the"）
```

### 3. 非捕获分组
```bash
grep -E '(?:abc|def)' file  # 仅分组不捕获
```

---

## 四、BRE与ERE对比
| 特性              | 基本正则(BRE)     | 扩展正则(ERE)     |
|-------------------|-------------------|-------------------|
| 元字符需要转义    | 是（如`\+`）      | 否                |
| 支持`+` `?` `\|`  | 需转义            | 直接支持          |
| 量词`{}`          | 需转义（如`\{3\}`）| 直接支持          |
| 激活方式          | `grep`默认        | `grep -E`         |

---

## 五、实战案例库

### 1. 复杂模式匹配
```bash
# 匹配合法邮箱地址
grep -E '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}' emails.txt

# 匹配IPv4地址
grep -E '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' logfile
```

### 2. Sed高级替换
```bash
# 替换手机号中间四位为****
sed -E 's/(1[3-9][0-9])[0-9]{4}([0-9]{4})/\1****\2/g' contacts.txt
```

### 3. Awk字段匹配
```bash
# 提取第二列以http开头的记录
awk '$2 ~ /^http/ {print $1,$3}' data.log
```

---

## 六、性能优化与技巧

### 1. 高效实践原则
- 避免使用`.*`贪婪匹配
- 优先匹配具体字符（如用`\d`替代`.`）
- 使用锚点缩小匹配范围

### 2. 调试工具
```bash
grep --color=auto     # 高亮显示匹配结果
nano -ET 4 file       # 显示制表符和行尾标识
```

### 3. 在线测试平台
- [regex101.com](https://regex101.com)（支持多语言正则测试）
- [regexr.com](https://regexr.com)（可视化正则表达式）

---

## 七、经典错误规避
| 错误类型               | 错误示例            | 修正方案           |
|------------------------|---------------------|--------------------|
| 未转义特殊字符         | `grep '3.14'`       | `grep '3\.14'`     |
| 量词位置错误           | `[0-9+]`            | `[0-9]+`           |
| 锚点使用不当           | `Error:^`           | `^Error:`          |
| 贪婪匹配导致性能问题   | `.*@.*\.com`        | `\w+@\w+\.com`     |

---

## 附：正则表达式速查表
| 符号     | 功能描述          |
| ------ | ------------- |
| `\b`   | 单词边界          |
| `\B`   | 非单词边界         |
| `\s`   | 空白字符（需`-P`参数） |
| `\S`   | 非空白字符         |
| `\w`   | 字母/数字/下划线     |
| `\W`   | 非单词字符         |
| `(?i)` | 忽略大小写（模式修饰符）  |
|        |               |
