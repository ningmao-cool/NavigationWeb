### **高频查询**
1. 先从redis找
	- 找到，返回
	- 没找到，去数据库
2. 数据库找
	- 找到，放在redis，并返回
	- 没找到，返回null或者抛出异常
---

### **缓存更新策略**

|**策略**|**内存淘汰**|**超时删除**|**主动更新**|
|---|---|---|---|
|**说明**|不用自己维护，利用 Redis 的内存淘汰机制，当内存不足时自动淘汰部分数据。下次查询时重新缓存。|给缓存数据添加 TTL 时间，到期后自动删除缓存。下次查询时更新缓存。|编写业务逻辑，在修改数据库的同时，更新缓存。|
|**一致性**|差|一般|好|
|**维护成本**|无|低|高|

---

#### **业务场景**

- **低一致性需求**：使用内存淘汰机制。例如：店铺类型的查询缓存。
- **高一致性需求**：主动更新，并以超时删除作为兜底方案。例如：店铺详情查询的缓存。

#### 缓存策略模式

##### **01. Cache Aside Pattern**

- **描述**：由缓存的调用者，在更新数据库的同时更新缓存。
- **特点**：不方便，一致性强，易维护。

###### 如何进行
- **删除缓存和更新缓存选择删除**
	1. 每次更新数据库都更新缓存，，无效写操作可能比较多。
	2. 更新数据库时让缓存失效，查询时在更新缓存，减少操作次数。
- **保证缓存和数据库操作同时成功和失败**
	1. 单体架构，将缓存和数据库操作放在一个事务
	2. 分布式架构，利用TCC等分布式事务方案
- **先操作缓存还是先操作数据库**
	1. 先删除缓存，可能刚删就来查了，由于查数据库和写缓存都比更新数据库快，可能会发生不一致的情况
	2. 先操作数据库，如果刚好缓存失效，查缓存没查到，去数据库读加写缓存的过程中，更新数据库和删除缓存已经完成了，就会发生不一致情况
	3. 但是查数据库和写缓存都比更新数据库快，且是恰好查的时候你就更新，还要缓存失效，可能性不高，所以先操作数据库
	4. 最后还有兜底的方案就是加个过期时间

---

##### **02. Read/Write Through Pattern**

- **描述**：缓存与数据库整合为一个服务，由服务来维护一致性。
- **特点**：调用者调用该服务，无需关心缓存一致性问题，难维护和难开发，方便。

---

##### **03. Write Behind Caching Pattern**

- **描述**：调用者只操作缓存，由其他线程异步地将缓存数据持久化到数据库，保证最终一致。
- **特点:** 难维护，方便，一致性不强

---

### **缓存穿透（Cache Penetration）**

缓存穿透指的是**查询的数据既不在缓存中，也不在数据库中**，导致每次查询都直接落到数据库上，进而可能引发数据库压力过大甚至宕机。

#### **问题原因**

1. **恶意攻击或漏洞利用**：攻击者恶意构造大量不存在的 key，不断发起查询。
2. **查询异常数据**：用户查询一些不存在的数据，由于缓存未命中，只能直接访问数据库

---

#### **解决方案**

##### **1. 布隆过滤器（Bloom Filter）**

- **原理**：
    - 布隆过滤器是一个高效的二进制数据结构，用于判断某个元素是否存在。
    - 将数据库的数据通过hash算法弄成二进制
    - 在查询前，先通过布隆过滤器判断 key 是否存在。
        - 如果不存在，直接返回，避免查询缓存和数据库。
        - 如果可能存在，再查询缓存和数据库。
- **优点**：占用内存少，性能高。
- **缺点**：存在一定的误判率（会误认为不存在的 key 存在，但不会把存在的 key 判断为不存在）。
- redis有自带的布隆过滤器

---

##### **2. 缓存空对象**

- **原理**：
    - 当查询一个不存在的数据时，将空值（如 `null` 或特殊标记）写入缓存，并设置较短的过期时间。
    - 下次查询时命中缓存的空对象，避免直接访问数据库。
- **优点**：实现简单。
- **缺点**：
    - 如果大量不同的不存在数据被查询，可能导致缓存中大量空对象，浪费空间。
    - 可能造成短暂的不一致
    - 需要合理设置空对象的过期时间。

---

##### **3. 参数校验**

- **原理**：
    - 对查询参数的合法性进行校验，过滤掉明显不可能存在的请求。
    - 例如，用户 ID 为负数、数据格式错误的 key 等，直接返回错误或空结果，不进入缓存和数据库逻辑。
- **优点**：成本低。
- **缺点**：只能解决部分问题，无法应对正常但不存在的数据查询。

---

##### **4. 限流与黑名单**

- **原理**：
    - 针对查询请求频繁、恶意请求的来源 IP 或账号，设置访问限流或加入黑名单。
- **优点**：能有效防御恶意攻击。
- **缺点**：需要额外开发限流、黑名单机制，增加复杂度。

---

##### **5. 兜底策略**

- **原理**：
    - 对于高频查询但可能不存在的 key，在请求进入缓存和数据库之前，通过设置默认值、降级策略等方式返回结果，避免对数据库和缓存造成压力。
- **优点**：快速响应，保护系统。
- **缺点**：不适合一致性要求高的场景。

---

#### **综合实践**

- **高一致性场景**：结合布隆过滤器和缓存空对象，避免误判与缓存穿透。
- **恶意攻击场景**：参数校验 + 限流与黑名单，有效应对恶意请求。
- **低一致性场景**：适当使用兜底策略快速返回。

#### **总结**

缓存穿透的解决方案需要根据具体业务场景权衡**一致性**、**复杂度**与**系统压力**。结合多种策略使用，能更有效地防止缓存穿透问题。

###  **缓存雪崩（Cache Avalanche）**

缓存雪崩指的是**缓存中大量的数据同时过期**，导致大量的请求直接访问数据库，瞬间造成数据库压力过大，甚至可能导致数据库宕机。

#### **问题原因**

1. **缓存过期时间设计不当**：缓存中的大量数据设置了相同的过期时间，导致这些数据在同一时刻过期，触发大量数据库查询。
2. **缓存失效引发**：缓存服务宕机或者不可用，导致大量请求落到数据库上。
3. **缓存未能及时更新**：缓存未及时更新，导致大量查询请求频繁访问数据库。

---

#### **解决方案**

##### **1. 设置不同的缓存过期时间**

- **原理**：
    - 通过设置缓存数据不同的过期时间，避免大量缓存数据在同一时间过期，避免瞬间大量数据库请求。
- **实现方式**：
    - 可以通过动态计算缓存的过期时间（例如基于当前时间戳加上一个随机值），确保每个缓存项的过期时间有所不同。
    - 对于一些重要数据，也可以设置较长的过期时间，而不那么重要的数据设置较短的过期时间。
- **优点**：有效避免了缓存过期导致的雪崩现象。
- **缺点**：需要对过期时间的设置做额外的管理和优化。

---

##### **2. 缓存预热**

- **原理**：
    - 在缓存系统启动时，提前加载或重新缓存一些高频访问的数据，避免缓存初期因没有数据而导致的查询压力。
- **实现方式**：
    - 可以通过定时任务或异步任务在空闲时间提前加载数据到缓存，保证缓存的完整性和稳定性。
- **优点**：防止缓存为空，避免突发请求直接落到数据库。
- **缺点**：需要额外的缓存管理机制，可能会增加缓存维护的复杂性。

---

##### **3. 双重检查锁**

- **原理**：
    - 在缓存失效后，通过加锁的方式确保只有一个请求去加载数据到缓存，避免多个请求同时查询数据库。
- **实现方式**：
    - 当缓存数据失效时，首先检查缓存中是否已经有数据，如果没有，则加锁，并重新加载数据到缓存。
    - 加锁确保只有一个线程执行数据库查询并更新缓存，其他线程等待该操作完成。
- **优点**：防止缓存失效导致的数据库请求雪崩。
- **缺点**：需要使用锁机制，可能带来性能问题，增加了实现的复杂度。

---

##### **4. 异步更新缓存**

- **原理**：
    - 使用异步任务在后台更新缓存，避免在缓存失效时立即访问数据库。
- **实现方式**：
    - 通过消息队列等异步方式，将缓存更新任务推送到后台执行，减少对数据库的压力。
    - 可结合定时任务在后台批量更新缓存。
- **优点**：减少同步操作对性能的影响，提高系统的吞吐量。
- **缺点**：缓存更新的延迟增加，可能导致短时间内的数据不一致。

---

##### **5. 限流与熔断**

- **原理**：
    - 对频繁请求的数据库进行限流，或者在缓存不可用的情况下启用熔断机制，保护系统稳定性。
- **实现方式**：
    - 使用限流策略控制请求频率，例如令牌桶、漏桶等算法。
    - 配置熔断策略，当数据库压力过大时，暂时停止部分请求，返回默认值或者错误信息。
- **优点**：有效保护后端数据库，避免系统因过载而崩溃。
- **缺点**：需要额外的限流和熔断机制，可能会影响系统的用户体验。

---

##### **6. 主从架构**

- **原理**：
    - 采用Redis的主从复制架构，将数据分布到多个节点，主节点负责数据的写入操作，而从节点负责读操作。这种方式可以将读取压力分摊到多个从节点，减轻主节点的负担。
    - 主从架构可以在缓存雪崩时通过从节点继续提供服务，避免所有查询都直接访问主节点或数据库。
- **实现方式**：
    - 配置多个从节点，通过负载均衡将读请求分发到各个从节点。
    - 使用Redis的主从复制机制，确保从节点的数据是与主节点同步的，并通过Redis Sentinel或其他工具来实现故障转移，保障高可用性。
- **优点**：
    - **分担压力**：通过分布式的读操作，能够有效分担主节点的读负载，避免因主节点过载导致的性能瓶颈。
    - **高可用性**：在主节点宕机时，从节点可以接管，保持系统的高可用性，减少因主节点故障导致的查询压力。
    - **故障转移**：通过Redis Sentinel或Cluster模式，能够在主节点发生故障时自动将从节点提升为新的主节点，保持系统正常运行。
- **缺点**：
    - **同步延迟**：由于从节点是异步同步数据，可能会存在数据滞后现象，在某些场景下可能出现短暂的不一致。
    - **增加资源开销**：维护多个节点会增加硬件资源的消耗，可能带来更多的运维负担。

---

##### **7. 多级缓存**

- **原理**：
    
    - 多级缓存是指在不同层次使用不同类型的缓存系统，例如：在应用层使用本地缓存（如Guava、Caffeine），在分布式系统中使用Redis或Memcached等缓存中间件。通过多级缓存来提高数据的访问效率，并降低对后端数据库的压力。
    - 多级缓存可以根据数据的访问频率、重要性等因素，将数据存储在不同层次的缓存中，减少缓存雪崩的影响。例如，常用的数据首先从本地缓存中获取，如果本地缓存没有再查分布式缓存，最后才会访问数据库。
- **实现方式**：
    
    - **本地缓存 + 分布式缓存**：首先在应用层配置本地缓存，避免重复的远程缓存查询。若本地缓存不存在，则访问分布式缓存（如Redis）。如果分布式缓存中也没有，则最终查询数据库。
    - **二级缓存系统**：可以将本地缓存作为一级缓存，Redis作为二级缓存，这样可以充分利用两者的优势。例如，本地缓存能够快速响应，减少对Redis的访问，而Redis作为持久化的缓存系统确保数据的长期存储。
    - **缓存回源机制**：在本地缓存和分布式缓存同时失效的情况下，应用可以采取回源策略，即从数据库获取数据并同步到缓存中。
- **优点**：
    
    - **性能优化**：通过本地缓存提高数据的读取速度，减少分布式缓存的访问频率，从而提升系统性能。
    - **降低数据库压力**：通过本地缓存和分布式缓存层级的组合，减少对数据库的直接访问，避免数据库成为瓶颈。
    - **提高数据可靠性**：多级缓存可以增加系统的容错性，即使某一层缓存失效，数据仍然可以通过其他层级获取。
- **缺点**：
    
    - **缓存一致性问题**：多级缓存可能导致数据在不同缓存层次之间的不一致，需要通过合理的失效策略和同步机制保证数据一致性。
    - **维护成本**：多级缓存的管理和维护更加复杂，需要协调不同缓存层级之间的数据同步、过期策略等。
    - **资源消耗**：多个缓存层次增加了内存的消耗和维护成本，可能需要更多的硬件资源。
---

#### **综合实践**

- **高可用场景**：使用缓存预热和异步更新缓存，避免缓存空缺和查询压力过大。
- **突发流量场景**：通过设置不同的过期时间和限流策略，避免数据库被压垮。
- **分布式系统**：结合双重检查锁和熔断策略，保证在高并发情况下缓存的有效性和系统的稳定性。

---

#### **总结**

缓存雪崩的解决方案需要综合考虑缓存的更新、失效机制以及系统的承载能力。通过合理设置缓存过期时间、预热缓存和限流熔断等策略，可以有效避免缓存雪崩带来的性能问题。

---

### **缓存击穿（Cache Breakdown）**

缓存击穿指的是在某些情况下，**缓存中没有数据**，并且该数据又恰好在某个高并发的请求中被频繁查询，导致大量请求直接访问数据库，给数据库带来巨大的压力。缓存击穿通常发生在缓存失效或数据本身不在缓存中时。

#### **问题原因**

1. **缓存数据失效**：当缓存中的某个数据过期失效时，可能会有多个并发请求同时去查询数据库，导致数据库压力骤增。
2. **缓存未命中**：某些数据初始未被缓存（例如首次访问时），当大量请求同时访问这个数据时，就会造成数据库的高并发访问。

#### **解决方案**

##### **1. 双重检查锁**

- **原理**：
    
    - 双重检查锁（Double-Check Locking）机制是一种防止缓存击穿的策略。当缓存数据失效时，只有第一个请求去查询数据库并更新缓存，其他请求等待第一个请求完成。（阻塞加重试）
    - 通过加锁的方式，确保在缓存失效的情况下，只有一个请求会去数据库查询并更新缓存，避免其他请求重复查询数据库。
- **实现方式**：
    
    - 采用“懒加载”策略，当缓存失效时，首先检查缓存是否为空。若为空，则加锁，防止其他线程继续查询数据库。
    - 数据库查询完成后，更新缓存并释放锁。
- **优点**：
    
    - 能有效避免并发访问数据库的情况。
    - 提高缓存的命中率，减少对数据库的压力。
- **缺点**：
    
    - 锁机制可能带来性能问题，尤其在高并发场景下可能成为瓶颈。
    - 实现较为复杂，需要额外的锁管理。

---

##### **2. 设置合理的缓存过期时间**

- **原理**：
    
    - 通过合理的设置缓存的过期时间，避免缓存中的数据在过期后立即失效，从而减少高并发请求访问数据库的情况。
    - 在缓存失效时，利用**延时更新**（Lazy Loading）策略，在后台更新缓存，减少大量并发请求对数据库的冲击。
- **实现方式**：
    
    - 设置适当的缓存过期时间，避免所有缓存项在同一时刻失效。
    - 对于高频访问的数据，可以设置更长的缓存过期时间。
    - 采用后台异步更新缓存的方法，逐步更新缓存而非同步加载，减少缓存失效时对数据库的瞬时压力。
- **优点**：
    
    - 通过合理的过期时间分布，降低缓存击穿的风险。
    - 后台更新缓存能有效减少瞬时访问压力。
- **缺点**：
    
    - 设置过期时间时需要考虑多种因素，可能会增加缓存策略的管理复杂度。
    - 延时更新可能会导致缓存数据的短暂不一致。

---

##### **3. 利用布隆过滤器（Bloom Filter）**

- **原理**：
    
    - 布隆过滤器（Bloom Filter）是一种高效的概率数据结构，用于判断一个元素是否在集合中。当某个数据不存在时，布隆过滤器可以提前判断并跳过对数据库的访问，避免缓存击穿问题。
    - 对于一些查询请求，布隆过滤器可以在缓存前先过滤掉不存在的数据，从而减少不必要的数据库查询。
- **实现方式**：
    
    - 在缓存层前增加布隆过滤器，判断数据是否存在。
    - 如果数据不存在，直接返回，避免查询缓存和数据库。
    - 如果数据可能存在，才去查询缓存和数据库。
- **优点**：
    
    - 节省缓存和数据库的查询压力，提高系统性能。
    - 布隆过滤器内存占用小，查询效率高。
- **缺点**：
    
    - 存在误判率，可能会将不存在的数据误认为存在，但不会影响已存在的数据。
    - 需要额外的布隆过滤器管理和计算。

---

##### **4. 请求排队与限流**

- **原理**：
    
    - 对请求进行排队和限流，避免在缓存失效的瞬间，由于大量请求同时访问数据库而造成系统过载。
    - 通过限流策略（如令牌桶、漏桶算法）控制访问频率，或者设置请求排队机制，控制并发请求的数量。
- **实现方式**：
    
    - 使用限流框架（如Hystrix、Resilience4j等）限制访问频率。
    - 对频繁的请求进行排队，按顺序依次访问数据库，避免大规模并发访问数据库。
- **优点**：
    
    - 可以有效减少系统对数据库的压力，保障系统稳定性。
    - 适用于高并发和资源受限的场景。
- **缺点**：
    
    - 可能会增加请求的延迟，影响用户体验。
    - 需要设计合理的排队和限流机制，避免过度限制。

---

##### **5. 缓存穿透与缓存空对象**

- **原理**：
    
    - 针对查询的**不存在数据**，可以使用缓存空对象（如`null`或特殊标记值）填充缓存。通过设置较短的过期时间避免缓存空对象造成过多空间占用。
    - 防止查询时，数据不存在的情况直接访问数据库，避免数据库的高并发访问。
- **实现方式**：
    
    - 当查询一个不存在的数据时，将空值（如`null`）写入缓存，并设置较短的过期时间，避免空对象长期存在。
    - 也可以在查询时检查缓存是否为空值，若为空则返回默认值或错误信息。
- **优点**：
    
    - 可以避免查询不存在数据时直接访问数据库，减少数据库压力。
    - 实现简单，易于扩展。
- **缺点**：
    
    - 如果查询大量不存在的数据，会导致缓存中大量空对象，浪费空间。
    - 可能会造成短期的不一致，特别是在高并发的场景下。

---
##### **6. 逻辑过期**

- **原理**：
    
    - 逻辑过期是一种通过在缓存中设置“过期时间标记”来模拟缓存数据过期的方法。与传统的物理过期（直接删除缓存）不同，逻辑过期不直接删除缓存，而是通过判断缓存中存储的过期时间标记来决定是否继续使用缓存。
    - 当缓存中的数据逻辑过期时，只有首次访问该缓存的数据时才会去数据库查询并更新缓存，而其他访问仍然直接使用缓存。通过这种方式，可以避免频繁访问数据库并减轻数据库压力，尤其适用于**热点数据**场景。
- **实现方式**：
    
    - 在缓存数据中添加一个过期标记（例如：`expireTime`），表示该缓存数据的逻辑过期时间。
    - 在每次查询缓存时，先检查缓存的`expireTime`，如果未到过期时间，则直接使用缓存数据；如果已到过期时间，则进行**延迟更新**（Lazy Loading），即只有第一个请求会去数据库加载数据并更新缓存（**会开一个新线程**），同时返回旧数据，其他请求等待缓存（也用到互斥锁）更新完成，释放锁。
    - 其他的请求这个时候也返回旧数据
    - 更新缓存时，更新缓存数据的值，并重新设置过期标记（例如：延长缓存数据的过期时间）。
- **优点**：
    
    - **减少数据库压力**：避免了缓存每次失效时都需要访问数据库，只在缓存逻辑过期时进行数据库查询。
    - **适用于热点数据**：对于访问频繁的数据，可以使用逻辑过期进行延迟更新，避免热点数据因频繁更新而导致的数据库压力过大。
    - **降低缓存穿透的风险**：通过延迟更新和逻辑过期，不会因为缓存短时间内失效导致频繁访问数据库。
- **缺点**：
    
    - **延迟更新**：在逻辑过期的情况下，可能会出现缓存数据暂时不一致的情况（在过期时间到达后直到第一个请求进行更新之前）。
    - **缓存管理复杂性**：需要增加缓存管理的复杂度，特别是对过期时间标记的管理和定期清理。
    - **可能导致缓存不及时更新**：如果缓存更新的频率较低，可能会存在用户获取到过期数据的风险。
- **适用场景**：
    
    - 适用于**热点数据**场景，尤其是那些读取频繁且更新不频繁的数据。例如，某些广告的展示数据、用户登录信息等，更新频率较低，但访问量大。
    - 对于一些**非实时一致性要求高**的场景，可以通过延迟更新机制来保证系统的高可用性和性能。

---

#### **总结**

缓存击穿问题主要是由于缓存中不存在的数据导致大量并发请求直接访问数据库，造成系统压力。解决缓存击穿的方法包括使用**双重检查锁**、**合理的过期时间设计**、**布隆过滤器**、**限流与排队机制**以及**缓存空对象**等策略。通过合理的设计和多种手段的结合，可以有效减轻数据库压力，提高系统的稳定性与响应速度。

---
#### 互斥锁

`SETNX` 是 Redis 中的一个命令，全称为 **"SET if Not Exists"**，即 **如果不存在，则设置**。它用于在 Redis 中设置键值对，但只有在键不存在的情况下才会设置成功。如果键已存在，则不会进行任何操作。

#### 逻辑过期
创建一个热点的类，里面有数据和过期时间两个字段，存入redis先


### **缓存工具类设计框架**

#### **1. 缓存穿透处理**

- **布隆过滤器（Bloom Filter）**：用于判断请求的数据是否存在于数据库中。如果数据不存在，则可以直接避免访问数据库，减少系统压力。
    - 使用 `SETNX` 或 `SETEX` 结合布隆过滤器的预处理来避免不必要的数据库查询。
- **缓存空对象**：当数据查询不存在时，缓存一个空对象，防止后续的查询频繁访问数据库。可以设置短暂的过期时间，以避免空对象长期占用缓存空间。

#### **2. 缓存雪崩处理**

- **设置不同的缓存过期时间**：通过随机化过期时间，防止大量缓存同时失效造成的数据库负载压力。
    - 例如，可以给每个缓存条目加上一个随机值，保证它们的过期时间不相同。
- **缓存预热**：提前加载一些高频访问的数据，避免缓存雪崩时大量请求直接访问数据库。
- **双重检查锁**：当缓存数据失效时，通过锁机制确保只有一个请求去加载数据，避免并发访问数据库的冲击。

#### **3. 缓存击穿处理**

- **双重检查锁**：确保在缓存失效后，只有一个请求去数据库加载数据并更新缓存，其他请求等待该请求完成，避免并发查询数据库。
- **合理的缓存过期时间**：避免缓存数据同时失效，分散缓存的过期时间，减少高并发时数据库的压力。

#### **4. 互斥锁与逻辑过期**

- **互斥锁**：利用 `SETNX` 命令或 Redisson 提供的分布式锁功能，避免缓存并发访问导致的数据不一致。
- **逻辑过期**：缓存数据不直接删除，而是设置一个逻辑过期时间，直到第一个访问缓存的请求时才去数据库加载数据，并且其他请求可以继续使用旧数据。可以通过 `expireTime` 字段管理。

#### **5. 缓存更新策略**

- **Cache Aside Pattern**：在修改数据库时手动更新缓存或让缓存失效。
- **Read/Write Through Pattern**：结合缓存和数据库，缓存和数据库操作同时进行。
- **Write Behind Caching**：缓存数据更新时延迟异步写入数据库，保证最终一致性。

#### **6. 缓存工具类示例**

```java
import java.util.function.Function;

public class CacheUtil {
    private static final String CACHE_PREFIX = "cache_";

    // 获取缓存
    public static <T> T getCache(String key, Class<T> clazz, Function<String, T> dbQueryFunction) {
        String cacheKey = CACHE_PREFIX + key;
        T cacheData = RedisClient.get(cacheKey);

        if (cacheData == null) {
            // 缓存未命中，执行数据库查询
            cacheData = dbQueryFunction.apply(key);  // 使用传入的数据库查询函数
            if (cacheData != null) {
                // 将数据写入缓存
                RedisClient.setex(cacheKey, 3600, cacheData); // 设置1小时过期
            }
        }
        return cacheData;
    }

    // 设置缓存
    public static <T> void setCache(String key, T value, int expireTimeInSeconds) {
        String cacheKey = CACHE_PREFIX + key;
        RedisClient.setex(cacheKey, expireTimeInSeconds, value);
    }

    // 删除缓存
    public static void removeCache(String key) {
        String cacheKey = CACHE_PREFIX + key;
        RedisClient.del(cacheKey);
    }

    // 布隆过滤器检测
    public static boolean isExistInCache(String key) {
        return BloomFilter.contains(key);
    }

    // 设置缓存空对象
    public static void setEmptyCache(String key, int expireTimeInSeconds) {
        String cacheKey = CACHE_PREFIX + key;
        RedisClient.setex(cacheKey, expireTimeInSeconds, "EMPTY");
    }
}

```

### **工具类功能说明**：

1. **`getCache`**：获取缓存数据，如果缓存没有命中，查询数据库并将数据写回缓存。
2. **`setCache`**：设置缓存数据，支持指定缓存过期时间。
3. **`removeCache`**：删除指定缓存数据。
4. **`isExistInCache`**：使用布隆过滤器检测数据是否存在。
5. **`setEmptyCache`**：设置缓存空对象，以防止缓存穿透。

## 实战
### 秒杀系统 - （一）订单 ID 的设计

#### **（一）问题分析**

在秒杀系统中，订单 ID 的生成非常关键。如果直接采用数据库自增 ID 的方式，会导致以下问题：

1. **ID 规律性明显**
    
    - 自增 ID 很容易推断出订单的生成时间及其他潜在信息，存在安全隐患。
    - 比如，通过分析 ID 的规律，用户可能会推测订单量或订单生成时间。
2. **单表数据量限制**
    
    - 自增 ID 在分布式系统中仅针对当前数据库实例生成，跨实例时容易产生冲突。
    - 随着单表数据量的增加，自增 ID 可能会面临性能瓶颈。

---

#### **解决方案：全局唯一 ID 生成器**

为了解决以上问题，可以引入 **全局唯一 ID 生成器**，确保生成的 ID 满足以下特点：

- **唯一性**：ID 在全局范围内不重复。
- **高可用**：能够随时生成ID，保证可用。
- **高性能**：能够快速生成 ID，保证性能。
- **递增性**：生成的 ID 尽量具备一定的递增规律，便于存储索引。
- **安全性**：避免 ID 直接暴露业务相关信息。

---

#### 实现全局 ID**

- Redis 是一个高性能的分布式缓存，它提供了 `INCR` 和 `INCRBY` 指令，可以高效地生成递增数字序列，适合作为分布式 ID 的核心组件。为了增强安全性，可以在 Redis 自增 ID 的基础上拼接其他信息，最终生成 **64 位长整型（long）** 的 ID，既节省空间又保证了唯一性。
-  **UUID 和 Snowflake 算法**：UUID 保证全球唯一性，但不递增，Snowflake 算法是基于时间戳和机器标识符生成递增的唯一 ID，适合分布式系统。
- **数据库单独管理 ID 表**：这种方法简单易懂，但在高并发场景下性能较差，通常用于低并发的应用场景。

---

#### **全局唯一 ID 的组成**

全局 ID 可以拆分为以下部分：

1. **符号位（1 位）**
    
    - 固定为 `0`，保证生成的 ID 是正数。
2. **时间戳（31 位）**
    
    - 以秒为单位，从某个固定的起始时间开始计数。
    - 可以支持使用长达 **69 年**（`2^31 / (365*24*3600)`）。
3. **序列号（32 位）**
    
    - Redis 自增生成的序列号，用于保证同一秒内的唯一性。
    - 每秒内支持生成 **2^32 - 1** 个唯一 ID。

最终，生成的 ID 为一个 64 位的长整型数，结构如下：

```
| 符号位（1 bit） | 时间戳（31 bit） | 序列号（32 bit） |
```

---

#### **示例代码实现**

以下是基于 Redis 的全局唯一 ID 生成器的简单实现示例：

```java
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class GlobalIdGenerator {

    private static final String REDIS_KEY_PREFIX = "order_id_sequence";
    private static final long START_EPOCH = 1640966400L; // 自定义起始时间（例如 2022-01-01 00:00:00）
    private static final long WEEKLY_RESET_INTERVAL = 7; // 每周重置间隔（单位：天）

    private final RedisTemplate<String, Object> redisTemplate;

    public GlobalIdGenerator(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 生成全局唯一 ID，基于当前时间戳和每周的序列号
     */
    public long generateId() {
        // 获取当前时间戳（单位：秒）
        long currentTime = System.currentTimeMillis() / 1000;

        // 计算从起始时间开始的时间差
        long timeDelta = currentTime - START_EPOCH;

        // 获取当前星期（1 - 7，表示周一到周日）
        long currentWeek = (currentTime / (60 * 60 * 24 * 7)) % WEEKLY_RESET_INTERVAL;

        // 生成 Redis 键，用于存储当前星期的序列号
        String redisKey = REDIS_KEY_PREFIX + ":week_" + currentWeek;

        // 获取 Redis 中的自增序列号
        Long sequence = redisTemplate.opsForValue().increment(redisKey);

        // 如果序列号是 1，意味着这一周是第一次生成 ID，因此需要设置过期时间
        if (sequence != null && sequence == 1) {
            // 设置序列号的过期时间为一周
            redisTemplate.expire(redisKey, WEEKLY_RESET_INTERVAL, TimeUnit.DAYS);
        }

        // 如果 Redis 获取的序列号为 null，表示获取失败，抛出异常或返回错误处理
        if (sequence == null) {
            throw new IllegalStateException("Failed to generate unique ID: Redis operation failed.");
        }

        // 组装 64 位 ID
        // 左移 32 位，然后加上 Redis 获取到的序列号
        return (timeDelta << 32) | sequence;
    }
}


```

---


### 秒杀系统 - （二）高并发下的超卖解决

#### **（一）问题分析**

在秒杀系统中，面对极高的并发请求，我们常常会遇到 **超卖** 的问题。**超卖** 指的是库存被多次扣减，导致库存量超过实际剩余量，造成卖出的商品超出系统实际可交付的数量，产生错误的订单。

#### **（二）超卖的根本原因**

超卖的主要原因是系统中多个请求同时访问并修改库存数据时，未做好并发控制，导致多个请求同时通过了库存检查并成功扣减库存，最终导致库存为负值。

#### **（三）高并发下超卖的常见解决方案**

为了解决高并发环境下的超卖问题，常用的方案有：

1. **分布式锁**
    
    使用分布式锁来保证同一时间只有一个请求可以操作库存，避免多个请求并发扣减库存。
    
    - **Redis 分布式锁**：通过 Redis 的 `SETNX` 命令实现分布式锁。每个请求在进行库存扣减之前都需要先获取锁，获取锁后才允许进行扣减操作。操作完成后释放锁。
    
    **优点**：能有效控制并发请求，防止超卖。 **缺点**：锁的竞争较为激烈，可能导致性能瓶颈。
    
2. **消息队列**
    
    使用消息队列来异步处理秒杀请求，将请求放入队列中，逐一处理。在库存扣减时，可以通过消息队列来排队处理，每次处理一个请求，避免并发修改库存。
    
    - **Kafka / RabbitMQ**：将每一个请求当做一个消息，发送到队列中，后台系统从队列中逐一消费并执行秒杀逻辑，保证库存不会被重复扣减。
    
    **优点**：解耦了前端和后端的处理，可以平滑高并发流量。 **缺点**：会引入一定的延迟，并且消息消费的速度可能成为瓶颈。
    
3. **乐观锁**
    
    在数据库中通过乐观锁来控制库存的修改。当扣减库存时，系统会先检查库存量，更新时会对比库存的版本号，确保库存没有被其他请求修改。如果库存发生变化，则拒绝当前请求或重试。
    
    - **MySQL 乐观锁**：通过 `version` 字段或者 `CAS`（Compare-And-Swap）机制来确保每次更新库存时不会发生并发冲突。
    - 分段锁可以提高成功率
    
    **优点**：能够减少锁的竞争，提升系统性能。 **缺点**：在高并发的情况下，可能会导致大量的重试和失败。
    
4. **库存预扣**
    
    在用户请求秒杀时，提前预扣库存，减少实际扣减库存的次数。比如，通过锁定用户的订单请求先行预占库存，直到订单确认后再执行扣减库存操作。
    
    **优点**：能够避免超卖，同时提升用户体验。 **缺点**：系统的状态管理变得复杂，需要处理大量的回滚和确认操作。
    

---

#### **（四）各方案的优缺点对比**

| 方案       | 优点                      | 缺点               |
| -------- | ----------------------- | ---------------- |
| **分布式锁** | 严格控制并发请求，防止超卖，简单易实现     | 性能瓶颈，可能导致请求等待和延迟 |
| **消息队列** | 解耦系统，能够平滑处理高并发流量，异步处理请求 | 引入延迟，消费速度可能成为瓶颈  |
| **乐观锁**  | 减少锁竞争，提高性能              | 高并发时可能导致大量的重试或失败 |
| **库存预扣** | 解决超卖问题，同时避免对库存的频繁操作     | 需要复杂的状态管理和库存确认机制 |

---

#### **（五）最佳实践**

在实际生产环境中，为了平衡性能和可用性，秒杀系统常常结合多种方案来解决超卖问题：

1. **结合 Redis 分布式锁和消息队列**：前端通过消息队列将请求发送到后台，后台通过 Redis 分布式锁确保每个请求都能顺序执行库存扣减。可以在高并发时将请求平滑地放入队列中进行处理，同时避免了库存并发操作。
    
2. **乐观锁与数据库事务**：结合乐观锁来确保库存更新时的正确性，通过版本号校验避免超卖。同时使用数据库事务，确保库存扣减和订单生成是原子操作，防止系统崩溃时出现数据不一致。（在这里直接用CAS查库存是否>0）
    
3. **库存预扣和异步确认**：先在用户请求时预占库存，用户支付完成后确认并真正扣减库存。未完成支付的订单会自动释放库存，避免库存被占用过久。
    
4. **限流和队列排队**：在高并发场景下，可以通过限流策略控制请求的速率，避免瞬间大量请求同时到达系统，进一步减少超卖的风险。
    

---

#### **（六）示例代码 - Redis 分布式锁**

以下是一个基于 Redis 实现的分布式锁的简单示例：

```java
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class DistributedLockService {

    private static final String LOCK_KEY = "seckill_lock"; // 锁的键
    private static final long LOCK_TIMEOUT = 10000L; // 锁超时时间（毫秒）

    private final RedisTemplate<String, Object> redisTemplate;

    public DistributedLockService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 获取分布式锁
     */
    public boolean acquireLock(String lockKey) {
        Boolean lockResult = redisTemplate.opsForValue().setIfAbsent(lockKey, "locked", LOCK_TIMEOUT, TimeUnit.MILLISECONDS);
        return lockResult != null && lockResult;
    }

    /**
     * 释放分布式锁
     */
    public void releaseLock(String lockKey) {
        redisTemplate.delete(lockKey);
    }

    /**
     * 秒杀业务逻辑
     */
    public void seckill(String productId) {
        // 获取锁
        if (acquireLock(LOCK_KEY)) {
            try {
                // 执行业务逻辑：库存扣减、订单生成等
                processSeckill(productId);
            } finally {
                // 释放锁
                releaseLock(LOCK_KEY);
            }
        } else {
            throw new RuntimeException("System is busy, please try again later.");
        }
    }

    private void processSeckill(String productId) {
        // 处理秒杀逻辑，扣减库存、生成订单等
        System.out.println("Processing seckill for product " + productId);
    }
}
```


---


#### （7） 悲观锁与乐观锁

##### **悲观锁**

- **定义**： 悲观锁认为线程安全问题一定会发生，因此在操作数据之前，先获取锁，确保线程串行执行，避免冲突。
    
- **特点**：
    
    - 每次操作数据前都需要先加锁，确保其他线程无法对该数据进行操作。
    - 加锁和解锁会带来一定的性能开销，适合并发量较低或冲突频繁的场景。
- **常见实现**：
    
    - **Java 示例**：`synchronized` 和 `ReentrantLock` 均属于悲观锁机制。

---

##### **乐观锁**

- **定义**： 乐观锁认为线程安全问题不一定会发生，因此不加锁，而是在更新数据时通过判断是否有其他线程对数据进行了修改来决定后续操作。
    
- **特点**：
    
    - 如果没有修改，则认为是安全的，可以直接更新数据。
    - 如果检测到已经被其他线程修改，说明发生了并发问题，此时可以选择重试或抛出异常。
    - 无需加锁，性能较高，适合并发量较大且冲突较少的场景。
- **常见实现**：
    
    - **数据库版本号控制**：通过对比数据的版本号或时间戳来实现乐观锁。
    - **CAS（Compare-And-Swap）操作**：利用硬件支持的原子操作，如 Java 的 `AtomicInteger`。
    - 分段加乐观锁可以提高成功率

---

##### **应用场景对比**

|特性|悲观锁|乐观锁|
|---|---|---|
|**适用场景**|并发量较低，冲突频繁的场景|并发量较高，冲突较少的场景|
|**性能**|加锁会影响性能，开销较高|不加锁，性能较高|
|**实现复杂度**|较低，直接加锁即可|较高，需要额外的冲突检测逻辑|
|**风险**|无风险，直接串行化操作|存在重试或冲突失败的可能性|

---

##### **Java 示例代码**

###### 1. **悲观锁的实现**（使用 `ReentrantLock`）

```java
import java.util.concurrent.locks.ReentrantLock;

public class PessimisticLockExample {
    private final ReentrantLock lock = new ReentrantLock();
    private int count = 0;

    public void increment() {
        lock.lock(); // 获取锁
        try {
            count++;
            System.out.println("Count incremented: " + count);
        } finally {
            lock.unlock(); // 释放锁
        }
    }
}
```

---

##### 2. **乐观锁的实现**（基于 CAS）

```java
import java.util.concurrent.atomic.AtomicInteger;

public class OptimisticLockExample {
    private final AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        while (true) {
            int current = count.get();
            int next = current + 1;
            if (count.compareAndSet(current, next)) {
                System.out.println("Count incremented: " + next);
                break;
            }
        }
    }
}
```

---


### 秒杀系统 - （三）一人一单的设计

#### **实现流程**

**流程说明：**

1. **提交请求**： 用户提交秒杀请求，包括优惠券 `id` 和用户 `id`。
    
2. **查询优惠券信息**： 根据提交的 `id` 查询当前优惠券的详细信息（如库存、秒杀状态等）。
     
3. **判断秒杀是否开始**： 如果秒杀尚未开始，则直接返回异常结果（秒杀未开启）。
    
4. **判断库存是否充足**： 检查优惠券的库存是否足够。如果库存不足，返回异常结果（库存不足）。
    
5. **查询订单**： 根据优惠券 `id` 和用户 `id`，查询是否已存在对应的订单。
    
6. **判断订单是否存在**：
    
    - **存在订单**：直接返回已存在的订单 `id`。
    - **不存在订单**：继续执行后续操作。
7. **扣减库存**： 对优惠券进行库存扣减操作，确保库存正确。
    
8. **创建订单**： 为当前用户创建新的订单，并记录订单信息。
    
9. **返回订单结果**： 返回生成的订单 `id`，操作成功结束。
    

---

#### **流程图解**

以下是流程中涉及的主要节点：

1. **判断条件**：
    
    - 秒杀是否开始。
    - 库存是否充足。
    - 是否已存在订单。
2. **操作节点**：
    
    - 查询优惠券信息。
    - 查询订单记录。
    - 扣减库存。
    - 创建订单。
3. **异常处理**：
    
    - 秒杀未开启。
    - 库存不足。
    - 已存在订单。

---

#### **核心代码实现**

```java
// 4. 判断库存是否充足
if (voucher.getStock() < 1) {
    // 库存不足
    return Result.fail("库存不足！");
}

Long userId = UserHolder.getUser().getId();

// 对用户Id加锁，防止并发问题
synchronized (userId.toString().intern()) {
    IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
    return proxy.createVoucherOrder(voucherId);
}

@Transactional
public Result createVoucherOrder(Long voucherId) {
    // 5. 一人一单校验
    Long userId = UserHolder.getUser().getId();
    // 查询是否已经存在订单
    int count = orderMapper.countByVoucherIdAndUserId(voucherId, userId);
    if (count > 0) {
        return Result.fail("您已经抢购过该优惠券！");
    }

    // 6. 扣减库存
    boolean success = voucherMapper.deductStock(voucherId);
    if (!success) {
        return Result.fail("库存不足！");
    }

    // 7. 创建订单
    VoucherOrder order = new VoucherOrder();
    order.setUserId(userId);
    order.setVoucherId(voucherId);
    orderMapper.save(order);

    // 返回订单结果
    return Result.ok(order.getId());
}

```

##### **逻辑分析**

1. **库存校验**
    
    - 检查优惠券的库存是否大于 0。如果库存不足，直接返回错误信息。
    - 这是秒杀系统的第一道防线，用于快速拦截请求，减少后续不必要的操作。
2. **用户级别加锁**
    
    - **加锁方式**：对 `userId` 转换为字符串后调用 `intern()` 方法，保证相同的 `userId` 获取的是同一个字符串对象，利用 Java 的字符串常量池实现锁的唯一性。
    - **作用**：通过对 `userId` 加锁，确保同一个用户在同一时间只能处理一个秒杀请求，避免高并发情况下的重复下单问题。
    - **加锁范围**：将用户级别的逻辑（如判断是否已下单、扣减库存、创建订单等）放在锁的保护范围内。
3. **代理调用**
    
    - **为什么使用代理调用？**
        - 在 Spring 的事务管理中，事务的生效是基于动态代理实现的。如果直接调用类内的方法，事务不会生效。
        - 通过 `AopContext.currentProxy()` 获取当前类的代理对象，再通过代理对象调用 `createVoucherOrder` 方法，以确保事务生效。
    - **事务作用范围**：
        - 包括扣减库存、创建订单等数据库操作，确保这些操作要么全部成功，要么全部失败，防止数据不一致。

---

#### **注意事项**

1. **并发安全**：
    
    - 库存扣减和订单创建需要保证原子性。
    - 使用 Redis 分布式锁、数据库事务或消息队列确保操作的正确性。
    - 集群模式下不能使用synchronized，不同的进程，JVM不同，是一个新的锁监视器
2. **重复订单检查**：
    
    - 使用唯一索引（如 `coupon_id + user_id`）或缓存（如 Redis 的 `SETNX`）避免重复下单。
3. **性能优化**：
    
    - 将热点数据（如库存信息）缓存到 Redis，减少数据库压力。
    - 优化查询和写入逻辑，尽量减少高并发下的锁争用。
4. **异常处理**：
    
    - 针对库存不足、订单已存在等异常场景进行友好提示。

---

### 秒杀系统 - （四）分布式锁

#### 1. **分布式锁的定义**

分布式锁是指在分布式系统或集群模式下，确保多个进程之间互斥访问资源的机制。其核心目的是通过锁的机制来控制多个进程的并发访问，避免数据不一致或冲突。

---
#### 2. **分布式锁的特点**

- **多进程可见**：适用于分布式系统或集群模式下，多个进程或线程能够看到并争抢同一个锁。
- **互斥性**：确保在某一时刻，只有一个进程能够持有锁，其他进程无法同时获取锁。
- **高可用性**：分布式锁需要具备高可用性，防止因网络问题或其他故障导致锁不可用。
- **高性能**：锁机制本身需要尽可能减少性能损失，以适应高并发的需求。
- **安全性**：确保锁的获取和释放过程安全可靠，防止死锁或锁泄漏等问题。

---

#### 3. **分布式锁的实现**

##### 常见的分布式锁实现方式：

- **MySQL**：通过 MySQL 本身的锁机制（如行锁）实现分布式锁。
- **Redis**：使用 Redis 的命令（如 `SETNX`）来实现分布式锁。
- **Zookeeper**：利用 Zookeeper 实现全局唯一且强一致性的分布式锁。

---

#### 4. **分布式锁的实现对比**

| 特性      | MySQL           | Redis              | Zookeeper        |
| ------- | --------------- | ------------------ | ---------------- |
| **互斥**  | 使用 MySQL 本身的互斥锁 | 使用 `setnx` 命令实现互斥锁 | 使用节点的唯一性和序列性实现互斥 |
| **高可用** | 较弱              | 高可用                | 高可用              |
| **高性能** | 一般              | 高性能                | 一般               |
| **安全性** | 支持自动释放          | 支持过期时间，直到释放锁       | 临时节点，自动释放        |

---

#### 5. **基于 Redis 的分布式锁**

分布式锁的实现依赖于以下两个基本方法：

- **获取锁**：
    
    - 通过 Redis 的 `SETNX` 命令来确保只允许一个进程获得锁。
    - 如果锁已经存在，`SETNX` 返回 false；如果锁不存在，返回 true，且设置锁的值。
    
    ```bash
    SET lock thread1 NX EX 10
    ```
    
    这个命令表示：如果没有名为 `lock` 的 key，就设置该 key 为 `thread1`，并且该锁会在 10 秒后自动过期。
    
- **释放锁**：
    
    - **手动释放**：通过删除 Redis 中对应的 key 来释放锁。
    - **超时释放**：当锁超时后，Redis 会自动释放锁。
    
    ```bash
    DEL key
    ```
    

---

#### 6. **Redis 分布式锁的流程**

- **加锁**：尝试通过 `SETNX` 获取锁。
- **检测锁是否成功**：如果获取锁成功，继续执行后续任务；否则，进入等待重试阶段。
- **任务执行**：获取锁成功后，执行业务逻辑。
- **释放锁**：任务完成后，通过 `DEL` 命令释放锁。

---


#### 7. 示例代码（伪代码）

```java
// 定义一个分布式锁类
class SimpleRedisLock {
    private String name;
    private StringRedisTemplate stringRedisTemplate;

    // 构造函数
    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    // 尝试获取锁
    public boolean tryLock(long timeoutSec) {
        long threadId = Thread.currentThread().getId();
        Boolean success = stringRedisTemplate.opsForValue()
            .setIfAbsent(KEY_PREFIX + name, String.valueOf(threadId), timeoutSec, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    // 释放锁
    public void unlock() {
        stringRedisTemplate.delete(KEY_PREFIX + name);
    }
}

// 使用示例
class LockExample {
    private StringRedisTemplate stringRedisTemplate;

    // 初始化 Redis 模板
    public LockExample(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    // 执行需要锁定的操作
    public void doSomethingWithLock() {
        SimpleRedisLock lock = new SimpleRedisLock("myLock", stringRedisTemplate);

        if (lock.tryLock(5)) { // 尝试获取锁，超时时间为5秒
            try {
                System.out.println("Lock acquired by thread: " + Thread.currentThread().getId());
                // 执行需要锁定的操作
                System.out.println("Executing critical section...");
            } finally {
                lock.unlock(); // 释放锁
                System.out.println("Lock released by thread: " + Thread.currentThread().getId());
            }
        } else {
            System.out.println("Failed to acquire lock");
        }
    }
}
```

---

#### 8. 分布式锁可能遇到的问题

#####  锁误删
- **描述**: 当一个线程获取锁后，在执行业务逻辑过程中如果超过了预设的锁超时时间（例如5秒），锁会被自动释放，而线程一又删了线程二的锁
- **影响**: 如果线程在锁被释放前未能完成业务逻辑，可能会导致其他线程误认为锁已释放而尝试获取锁，从而引发并发问题。

##### 流程

1. **线程1**:
   - 获取锁并开始执行业务逻辑。
   - 在业务逻辑执行过程中，锁超时释放。
   - 业务逻辑完成后，试图释放锁，但锁已被释放。

2. **线程2**:
   - 在线程1释放锁后，尝试获取锁并成功获取。
   - 执行业务逻辑。

3. **线程3**:
   - 在线程1释放线程二的锁后，尝试获取锁并成功获取。
   - 执行业务逻辑。

##### 解决方案

1. **合理设置锁的超时时间**：
	根据业务逻辑的执行时间设置合理的锁超时时间，避免锁被误释放。
	
2. **锁释放前检查：**
	线程执行完业务逻辑后，判断当前锁是不是自己的，uuid拼线程id
	

##### 其他问题

**业务执行完后，判断完可能又会有阻塞**

- 例如jvm的垃圾回收会阻塞，然后又又又恰好超时释放，就又会到导致一样的问题

解决方法，判断锁和释放锁要是原子性
- redis的事务
- lua脚本

 **Lua 脚本示例：**

Redis 提供了 `EVAL` 命令来执行 Lua 脚本，以保证多个 Redis 命令的原子性执行：

```lua
if (redis.call('GET', KEYS[1]) == ARGV[1]) then     
	return redis.call('DEL', KEYS[1]) 
end 
return 0

```

**使用 RedisTemplate 调用 Lua 脚本：**
```java
String script = "if (redis.call('GET', KEYS[1]) == ARGV[1]) then return redis.call('DEL', KEYS[1]) end return 0";
List<String> keys = Arrays.asList("lock");
List<String> args = Arrays.asList("thread1");

Object result = stringRedisTemplate.execute(new DefaultRedisScript<>(script, Long.class), keys, args);

```
可以用个静态代码块加载脚本,防止io消耗

---

#### 9. 分布式锁进一步优化

##### 现存问题分析

1. **不可重入问题**
   - 同一个线程无法多次获取同一把锁
   - 场景：线程A获取锁后调用方法B，如果B也需要获取相同的锁就会失败

2. **不可重试问题**
   - 获取锁只尝试一次就返回false
   - 没有重试机制，导致获取锁的成功率降低

3. **超时释放问题**
   - 锁超时释放虽然可以避免死锁
   - 但如果业务执行时间过长，可能会导致锁提前释放
   - 存在安全隐患

4. **主从一致性问题**
   - 当Redis提供了主从集群时
   - 主从同步存在延迟
   - 如果在主从同步过程中的锁数据出现问题，可能会出现锁失效

##### Redisson解决方案

Redisson是一个在Redis基础上实现的Java分布式数据网格（In-Memory Data Grid），提供了多种分布式锁的实现：

1. **锁的类型**
   - 可重入锁（Reentrant Lock）
   - 公平锁（Fair Lock）
   - 联锁（MultiLock）
   - 红锁（RedLock）
   - 读写锁（ReadWriteLock）
   - 信号量（Semaphore）
   - 可过期性信号量（PermitExpirableSemaphore）
   - 闭锁（CountDownLatch）

##### 相关资源
- 官网：https://redisson.org
- GitHub：https://github.com/redisson/redisson




##### Redisson入门使用指南

###### 1. 添加依赖
```xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.13.6</version>
</dependency>
```

###### 2. 配置Redisson客户端
```java
@Configuration
public class RedisConfig {
    @Bean
    public RedissonClient redissonClient() {
        // 创建配置
        Config config = new Config();
        // 添加redis地址，这里使用单节点地址
        // 也可以使用config.useClusterServers()添加集群地址
        config.useSingleServer()
            .setAddress("redis://192.168.150.101:6379")
            .setPassword("123321");
        // 创建客户端
        return Redisson.create(config);
    }
}
```

###### 3. 使用Redisson的分布式锁
```java
@Resource
private RedissonClient redissonClient;

@Test
void testRedisson() throws InterruptedException {
    // 获取锁（可重入），指定锁的名称
    RLock lock = redissonClient.getLock("anyLock");
    
    // 尝试获取锁，参数分别是：获取锁的最大等待时间(1秒)，锁自动释放时间(10秒)，时间单位
    boolean isLock = lock.tryLock(1, 10, TimeUnit.SECONDS);
    
    // 判断获取锁成功
    if(isLock) {
        try {
            System.out.println("执行业务");
        } finally {
            // 释放锁
            lock.unlock();
        }
    }
}
```

###### 重要特性说明

1. **可重入性**
   - 通过`RLock`接口实现可重入锁
   - 同一个线程可以多次获取同一把锁

2. **自动续期**
   - 通过`tryLock`方法可以设置锁的自动释放时间
   - 如果业务未完成，Redisson会自动续期

3. **锁的超时释放**
   - 可以设置获取锁的最大等待时间
   - 可以设置锁的自动释放时间，避免死锁

4. **异常处理**
   - 使用`try-finally`结构确保锁的释放
   - 即使发生异常，也能保证锁被正确释放


---

### Redisson的优点和源码
#### **1. 获取锁的 Lua 脚本**

Redisson 使用 Lua 脚本来原子地获取锁，确保锁的获取、重入以及有效期设置都在一个操作中完成，避免了多个 Redis 请求带来的竞争条件。

##### **Lua 脚本实现：**

```lua
local key = KEYS[1]  -- 锁的 key
local threadId = ARGV[1]  -- 线程唯一标识
local releaseTime = ARGV[2]  -- 锁的有效期

if (redis.call('exists', key) == 0) then
    -- 锁不存在，获取锁
    redis.call('hset', key, threadId, '1')  -- 设置锁，使用哈希存储，线程ID作为键，值为 1
    redis.call('expire', key, releaseTime)  -- 设置锁的有效期，防止死锁
    return 1  -- 返回 1 表示获取锁成功
end

-- 锁已存在，判断 threadId 是否是自己
if (redis.call('hget', key, threadId) == 1) then
    -- 锁存在且是当前线程请求的锁，进行重入
    redis.call('hincrby', key, threadId, '1')  -- 重入锁，增加重入计数
    redis.call('expire', key, releaseTime)  -- 重置锁的有效期
    return 1  -- 返回 1 表示重入成功
end

return 0  -- 获取锁失败
```

##### **注释解析**：

1. **`exists`**：首先检查锁的 key 是否存在。如果不存在，说明当前没有线程持有该锁，可以成功获取锁。
2. **`hset` 和 `hget`**：通过 Redis 哈希结构来存储锁信息，其中 `threadId` 作为字段，`1` 表示当前线程持有锁。`hget` 用于获取当前线程是否已持有锁。
3. **`hincrby`**：如果锁已存在且当前线程持有该锁，使用 `hincrby` 对线程的重入计数进行自增，实现可重入锁。
4. **`expire`**：设置锁的过期时间，以防止死锁问题。如果锁的持有线程在任务执行中没有及时释放锁，过期时间会被更新。

---

#### **2. 锁的状态机**

Redisson 使用了状态机来管理锁的生命周期，包括获取锁、重入和释放。

##### **源码解读：**

```java
private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
    if (leaseTime != -1) {
        return tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
    }

    RFuture<Long> ttlRemainingFuture = tryLockInnerAsync(waitTime,
        commandExecutor.getConnectionManager().getCfg().getLockWatchdogTimeout(),
        TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_LONG);

    ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
        if (e != null) {
            return;
        }

        // 锁获取成功
        if (ttlRemaining == null) {
            scheduleExpirationRenewal(threadId);  // 启动锁的续期任务
        }
    });
}
```

##### **注释解析**：

1. **`tryAcquireAsync`**：这是一个异步方法，尝试获取锁。如果 `leaseTime` 不为 -1，直接调用 `tryLockInnerAsync` 获取锁，并设置锁的有效期。
2. **`ttlRemainingFuture`**：如果 `leaseTime` 为 -1，则启动 Watchdog 机制，通过异步调用 `tryLockInnerAsync` 获取锁，并在获取成功后启动锁的续期任务。

---

#### **3. Watchdog 机制的实现**

Watchdog 机制的作用是定时续期锁，防止锁在长时间操作过程中过期。这样可以确保长时间持有锁的线程不会因为超时而导致任务被中断。

##### **源码解读**：

```java
private void scheduleExpirationRenewal(long threadId) {
    ExpirationEntry entry = new ExpirationEntry(threadId);  // 创建一个锁的续期条目
    ExpirationEntry oldEntry = EXPIRATION_RENEWAL_MAP.putIfAbsent(getEntryName(), entry);  // 将续期条目放入续期映射中

    if (oldEntry != null) {
        oldEntry.addThreadId(threadId);  // 如果该锁已有续期条目，添加当前线程的 threadId
    } else {
        entry.addThreadId(threadId);  // 如果是新锁，直接添加并启动续期
        renewExpiration();  // 启动锁的续期操作
    }
}
```

##### **注释解析**：

1. **`scheduleExpirationRenewal`**：成功获取锁后，启动 Watchdog 机制，定时检查锁是否需要续期。
2. **`EXPIRATION_RENEWAL_MAP`**：用于存储每个锁的续期条目，防止多个线程竞争锁时错过续期操作。
3. **`renewExpiration`**：定时续期锁的过期时间。

---

#### **4. 锁的获取与时间戳判断**

Redisson 通过系统时间判断是否可以继续获取锁。如果获取锁的时间超过了最大等待时间，则会尝试退出或继续等待。

##### **源码解读**：

```java
@Override
public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
    long time = unit.toMillis(waitTime);  // 转换等待时间为毫秒
    long current = System.currentTimeMillis();  // 获取当前系统时间
    long threadId = Thread.currentThread().getId();  // 获取当前线程的 ID

    Long ttl = tryAcquire(waitTime, leaseTime, unit, threadId);  // 尝试获取锁

    // 锁获取成功
    if (ttl != null) {
        return true;
    }

    time = System.currentTimeMillis() - current;  // 计算已经等待的时间

    if (time < 0) {
        acquireFailed(waitTime, unit, threadId);  // 如果超时，获取锁失败
        return false;
    }

    current = System.currentTimeMillis();  // 更新当前时间
    RFuture<Boolean> subscribeFuture = subscribe(threadId);  // 订阅锁状态
    if (!subscribeFuture.await(time, TimeUnit.MILLISECONDS)) {
        subscribeFuture.cancel(!mainInterruptRunning);  // 等待超时，取消订阅
        subscribeFuture.onComplete((res, e) -> {
            // 错误处理
        });
    }
}
```

##### **注释解析**：

1. **`tryLock`**：尝试获取锁的方法，计算时间并判断是否获取锁成功。
2. **`subscribe`**：如果锁被其他线程占用，系统会订阅锁的状态，等待锁的释放。

---

#### **5. 锁的续期与取消**

锁的续期操作是为了防止锁在任务执行过程中被自动释放，从而确保任务能够继续执行。

##### **续期操作**：

```java
RFuture<Boolean> future = renewExpirationAsync(threadId);
future.onComplete((res, e) -> {
    if (e != null) {
        log.error("Can't update lock " + getName() + " expiration", e);
        return;
    }

    if (res) {
        // 续期成功，重新调度续期
        renewExpiration();
    }
});
```

##### **取消续期**：

```java
void cancelExpirationRenewal(Long threadId) {
    ExpirationEntry task = EXPIRATION_RENEWAL_MAP.get(getEntryName());
    if (task == null) {
        return;
    }

    if (threadId != null) {
        task.removeThreadId(threadId);  // 移除线程的续期信息
    }

    if (threadId == null || task.hasNoThreads()) {
        Timeout timeout = task.getTimeout();
        if (timeout != null) {
            timeout.cancel();  // 取消续期任务
        }

        EXPIRATION_RENEWAL_MAP.remove(getEntryName());  // 从映射中移除续期条目
    }
}
```

##### **注释解析**：

1. **续期与取消续期**：确保锁在持有期间不会自动过期，任务完成后取消续期，释放锁。

---

#### 6. 流程图


##### Redisson分布式锁流程图

![[Pasted image 20250127134936.png]]



---

#### **7. Redisson 分布式锁原理总结**

- **Redisson 分布式锁** 使用 Lua 脚本来原子化地获取和重入锁，避免了多次网络请求带来的延迟和竞争条件。
- **Watchdog 机制** 每隔一段时间（通常是releaseTime的三分之一）重置超时时间。，防止因任务长时间运行而导致锁过期。
- **可重入锁** 允许同一线程多次获取锁，适用于递归调用或多次访问共享资源的场景。
- **锁的释放与续期**：任务完成后取消续期，确保锁被正确释放。
- **锁重试**：利用信号量和PubSub功能实现等待和唤醒机制，提高获取锁的成功率。

---


### **Redisson 分布式锁与主从一致性问题**

#### ** Redisson 的 multiLock**

- **原理**：
    - 通过多个 Redis 节点，要求在所有节点上都成功获取锁，才算锁获取成功。这保证了分布式环境下锁的一致性。
- **缺陷**：
    - **运维成本高**：需要多个 Redis 节点，增加了运维的复杂度。
    - **实现复杂**：需要确保在多个节点之间的数据一致性，保证锁的正确性和可靠性。

---


#### **: 单一 Redis Master 和 Slave 模型**

- **获取锁**：
    - Java 应用通过命令 `SET lock thread1 NX EX 10` 向 Redis 发送获取锁请求。如果成功，则 `lock = thread1`，即当前锁被 `thread1` 占用。
    - Redis 主节点接收到请求后，会将锁的状态同步给从节点。
- **锁失效**：
    - 如果锁超时或被其他操作覆盖，锁会失效。此时，其他线程可以重新获取锁。

#### ** 多 Redis 节点模型**

- **获取锁**：
    
    - Java 应用在多个 Redis 节点上尝试获取锁，每个节点执行 `SET lock threadX NX EX 10` 命令。
    - 如果所有节点都成功获取锁，则认为锁被成功获取。
- **主从同步**：
    
    - 每个 Redis 节点之间进行主从同步，确保数据一致性，锁的状态在所有节点间一致。

---

#### **示例代码**

```java
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import java.util.*;

public class DistributedLockExample {

    private static final int FAILED_LOCKS_LIMIT = 3;
    private static final long DEFAULT_WAIT_TIME = 5000L;
    private static final long DEFAULT_LEASE_TIME = 10000L;

    public static void main(String[] args) {
        RedissonClient redisson = Redisson.create();

        List<RLock> locks = new ArrayList<>();
        locks.add(redisson.getLock("lock1"));
        locks.add(redisson.getLock("lock2"));

        try {
            acquireLocks(locks);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static boolean acquireLocks(List<RLock> locks) throws InterruptedException {
        int failedLocksLimit = FAILED_LOCKS_LIMIT;
        List<RLock> acquiredLocks = new ArrayList<>(locks.size());

        for (ListIterator<RLock> iterator = locks.listIterator(); iterator.hasNext();) {
            RLock lock = iterator.next();
            boolean lockAcquired = false;

            try {
                if (DEFAULT_WAIT_TIME == -1 && DEFAULT_LEASE_TIME == -1) {
                    lockAcquired = lock.tryLock();
                } else {
                    long awaitTime = Math.min(DEFAULT_WAIT_TIME, DEFAULT_LEASE_TIME);
                    lockAcquired = lock.tryLock(awaitTime, DEFAULT_LEASE_TIME, TimeUnit.MILLISECONDS);
                }
            } catch (Exception e) {
                lockAcquired = false;
            }

            if (lockAcquired) {
                acquiredLocks.add(lock);
            } else {
                failedLocksLimit--;
                if (failedLocksLimit <= 0) {
                    return false;
                }
            }
        }

        return true;
    }

    private static void unlockInner(List<RLock> locks) {
        for (RLock lock : locks) {
            lock.unlock();
        }
    }
}
```

---

#### **代码解释**

1. **初始化 Redisson 客户端**：
    
    - 使用 `Redisson.create()` 创建一个 Redisson 客户端实例来连接 Redis 服务。
2. **定义锁列表**：
    
    - 通过 `redisson.getLock("lock1")` 和 `redisson.getLock("lock2")` 获取两个独立的锁对象。
3. **尝试获取锁**：
    
    - `acquireLocks` 方法尝试依次获取所有锁，使用 `lock.tryLock()` 方法尝试获取锁。如果超时或其他问题发生，返回 `false` 表示获取锁失败。
    - 如果所有锁都获取成功，则返回 `true`。
4. **释放锁**：
    
    - `unlockInner` 方法依次释放所有已获取的锁。

---

### 秒杀优化

#### **核心流程**  
1. **Redis 原子操作**  
   - **Lua 脚本**：  
     - 检查库存（`stockKey`）是否充足。  
     - 校验用户是否已下单（`orderKey`）。  
     - 扣减库存（`incrby stockKey -1`）。  
     - 记录用户ID到订单集合（`sadd orderKey userId`）。  
     - **返回值**：  
       - `0`：成功；`1`：库存不足；`2`：重复下单。  

2. **Java 业务逻辑**  
   - 执行 Lua 脚本，根据返回值处理：  
     - **非 0**：直接返回错误（库存不足/重复下单）。  
     - **0**：生成订单ID，将订单信息存入阻塞队列（异步处理）。  
   - **阻塞队列**：解耦下单与持久化操作，提升并发性能。  

3. **异步处理订单**  
   - 从阻塞队列中取出订单，使用分布式锁（Redisson）确保一人一单。  
   - **关键点**：  
     - 代理对象需在主线程获取（因 `AopContext` 依赖 ThreadLocal）。  
     - 异步线程无法直接获取代理对象，需提前传递。  

---

#### **代码要点**  

1. **Lua 脚本**  
   ```lua
   -- 扣减库存并记录用户
   if redis.call('get', stockKey) <= 0 then return 1 end
   if redis.call('sismember', orderKey, userId) == 1 then return 2 end
   redis.call('incrby', stockKey, -1)
   redis.call('sadd', orderKey, userId)
   return 0
   ```

2. **Java 执行脚本**  
   ```java
   Long result = stringRedisTemplate.execute(
       SECKILL_SCRIPT, Collections.emptyList(), voucherId.toString(), userId.toString()
   );
   if (result != 0) {
       return Result.fail(result == 1 ? "库存不足" : "不能重复下单");
   }
   // 存入阻塞队列
   BlockingQueue<VoucherOrder> queue = new LinkedBlockingQueue<>();
   queue.put(voucherOrder);
   ```

3. **异步处理（需主线程传递代理对象）**  
   ```java
   // 主线程中获取代理对象，并存入订单对象
   IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
   voucherOrder.setProxy(proxy); // 自定义字段保存代理对象

   // 异步线程处理时调用代理对象的方法
   private void handleVoucherOrder(VoucherOrder voucherOrder) {
       RLock lock = redissonClient.getLock("lock:order:" + userId);
       try {
           if (lock.tryLock(1, 10, TimeUnit.SECONDS)) { // 设置超时
               voucherOrder.getProxy().createVoucherOrder(voucherOrder); // 使用传递的代理对象
           }
       } finally {
           lock.unlock();
       }
   }
   ```

---

#### **注意事项**  
1. **代理对象传递**  
   - `AopContext.currentProxy()` 基于 ThreadLocal，异步线程中无法直接获取。  
   - **解决**：在主线程获取代理对象后，将其绑定到订单对象，传递至异步线程。  

2. **分布式锁优化**  
   - 设置锁超时时间（如 `tryLock(1, 10, SECONDS)`），避免死锁。  
   - 锁粒度：按用户ID加锁（`lock:order:{userId}`），减少竞争。  

3. **阻塞队列管理**  
   - 限制队列容量，防止内存溢出（如 `new LinkedBlockingQueue<>(1000)`）。  
   - 添加拒绝策略，队列满时丢弃请求或返回错误。  

---

#### **流程图**  
```
用户请求 → Lua脚本（Redis原子校验） → 成功 → 存入阻塞队列 → 异步处理（代理对象+分布式锁） → 完成订单  
                     ↓  
                 库存不足/重复下单 → 直接返回错误  
```

---

#### 为什么要代理对象

##### 问题所在：

主线程和异步线程是**两个独立的线程**，它们的执行上下文和生命周期是不同的。如果你直接在异步线程中调用方法，可能会丢失以下几个关键因素：

1. **事务控制**：如果你在主线程中开启了事务，事务的上下文应该在异步线程中继续有效。但如果直接在异步线程中调用方法，可能会失去这个事务上下文，导致事务的提交或回滚无法正确执行。
2. **分布式锁**：在主线程中，你可能已经获取了分布式锁，确保只有一个线程能够执行关键操作。但如果在异步线程中直接执行，可能会导致锁管理失效，使得多个线程同时执行关键操作，从而引发并发问题。
3. **AOP拦截器**：Spring 的事务管理、日志记录等横切关注点（比如事务、权限控制等）通常通过 **AOP代理** 实现。如果直接调用方法，这些 AOP 的功能可能会被忽略。

##### 为什么需要代理对象？

- **代理对象的作用**：Spring 使用代理来为你提供一些额外的功能，比如事务管理、权限控制等。这些功能都是通过 AOP 代理来实现的。当你在主线程中调用方法时，Spring 会创建一个代理对象来处理这些额外的功能。
    
    - **事务管理**：如果你的方法在一个事务中执行，代理对象会确保在方法执行前后，事务正确开启、提交或者回滚。
    - **分布式锁**：在主线程中，分布式锁可能会在你调用方法时被加锁。代理对象会确保这个锁在异步线程中仍然生效。
- **异步线程中的问题**：如果你直接在异步线程中执行方法，那么 **异步线程并不能自动继承主线程的事务和锁的上下文**。这意味着：
    
    - 事务不会被正确传播。
    - 分布式锁可能不会生效。
    - AOP功能无法应用。

---

#### **总结**  
- **Redis Lua 脚本**：保证原子性，解决超卖和重复下单。  
- **阻塞队列**：异步削峰，提升吞吐量。  
- **代理对象传递**：主线程获取后绑定到订单，解决异步线程的 ThreadLocal 隔离问题。  
- **分布式锁**：细粒度控制用户并发，避免重复下单。

### Redis消息队列

你提供的图片内容主要介绍了如何使用Redis消息队列实现异步秒杀功能。以下是整理后的笔记，以便更好地理解和应用这些信息：

---

以下是整理、补充和润色后的笔记，内容更加清晰、逻辑更流畅，并补充了一些关键点以增强理解。

---

### **Redis 消息队列实现异步秒杀**

#### **1. 消息队列基本概念**
**消息队列（Message Queue）** 是一种用于存储和管理消息的队列结构，也被称为 **消息代理（Message Broker）**。它在系统架构中扮演着关键角色，通过解耦生产者和消费者之间的直接交互，提高系统的可扩展性和可靠性。

- **消息队列**：负责存储和管理消息，作为中间件协调生产者和消费者。
- **生产者**：发送消息到消息队列，通常由业务逻辑产生数据并将其放入队列。
- **消费者**：从消息队列获取消息并进行处理，可以是多个消费者同时处理消息以提高效率。

---

#### **2. Redis 实现消息队列的方式**

Redis 提供了三种不同的方式来实现消息队列，每种方式都有其特点和适用场景：

##### **2.1 List 结构**
- **原理**：基于 Redis 的 `List` 数据结构模拟消息队列。
- **操作**：
  - 生产者使用 `LPUSH` 命令将消息添加到列表头部。
  - 消费者使用 `RPOP` 或 `BRPOP` 命令从列表尾部取出并处理消息。
- **优点**：
  - 简单易用，适合简单的消息队列需求。
  - 支持阻塞读取（`BRPOP`），避免轮询带来的性能开销。
- **缺点**：
  - 缺乏消息确认机制，可能会出现消息丢失的情况。
  - 只支持单消费者，限制了系统的扩展性。

##### **2.2 Pub/Sub**
- **原理**：基于发布/订阅模式，实现点对点的消息传递。
- **操作**：
  - 生产者使用 `PUBLISH` 命令向指定频道发送消息。
  - 消费者使用 `SUBSCRIBE` 命令订阅一个或多个频道，接收对应频道的消息。
- **优点**：
  - 实时性高，适用于需要即时通知的场景。
  - 支持多生产者、多消费者的高效消息分发。
- **缺点**：
  - 不支持持久化，消息一旦被消费即消失，无法重试。
  - 如果消费者未订阅或网络中断，消息会丢失。

##### **2.3 Stream**
- **原理**：Redis 5.0 引入的流式数据结构，提供更完善的消息队列模型。
- **操作**：
  - 生产者使用 `XADD` 命令将消息添加到流中。
  - 消费者使用 `XREAD` 或 `XREADGROUP` 命令读取消息，并支持消息确认和重试机制。
- **优点**：
  - 支持消息持久化、确认机制和多消费者组。
  - 适用于复杂的消息队列需求，如高并发场景下的异步秒杀。
- **缺点**：
  - 相对复杂，需要更多的配置和管理。

---

#### **3. 应用场景与优势**
- **异步秒杀**：在高并发场景下，使用消息队列可以有效缓解服务器压力，防止 JVM 内存不足导致的服务宕机。
- **解耦生产者与消费者**：生产者只需将消息放入队列，无需关心消费者的处理情况，提高了系统的灵活性和可维护性。
- **消息持久化与重试机制**：Stream 结构支持消息持久化和确认机制，确保消息不会丢失，即使服务宕机也能恢复处理。

---

### **基于 List 结构模拟消息队列**

#### **队列实现方式**
由于队列的入口和出口不在同一边，我们可以利用以下组合来实现：
- **LPUSH 结合 RPOP**：生产者使用 `LPUSH` 将消息添加到列表头部，消费者使用 `RPOP` 从列表尾部取出并处理消息。
- **RPUSH 结合 LPOP**：生产者使用 `RPUSH` 将消息添加到列表尾部，消费者使用 `LPOP` 从列表头部取出并处理消息。

#### **注意事项**
当队列中没有消息时，直接使用 `RPOP` 或 `LPOP` 操作会返回 `null`，并不会像 JVM 的阻塞队列那样自动阻塞并等待消息。因此，在实际应用中应使用 `BRPOP` 或 `BLPOP` 来实现阻塞效果，确保在没有消息时消费者可以等待直到有新的消息到来。

#### **示例图解**
- **生产者** 使用 `LPUSH` 将消息 `msg2` 添加到消息队列的头部。
- **消费者** 使用 `RPOP` 从消息队列的尾部取出并处理消息 `msg1`。

#### **优缺点**
###### **优点**
1. **不受JVM内存限制**：利用 Redis 存储，消息队列的容量不再受限于 JVM 内存上限，可以存储更多的消息。
2. **数据安全性高**：基于 Redis 的持久化机制，即使服务器重启或故障，数据也不会丢失，保证了数据的安全性。
3. **消息有序性**：消息按照先进先出（FIFO）的原则进行处理，可以满足对消息顺序有严格要求的场景。

###### **缺点**
4. **无法避免消息丢失**：虽然 Redis 提供了持久化机制，但在某些极端情况下（如网络中断、Redis 服务异常等），仍有可能导致消息丢失。
5. **只支持单消费者**：基于 List 的消息队列模型只能有一个消费者处理消息，不支持多消费者并发处理，限制了系统的扩展性和处理能力。

---

### **基于 Pub/Sub 的消息队列**

#### **Pub/Sub 概述**
**Pub/Sub（发布/订阅）** 是 Redis 2.0 版本引入的消息传递模型。在这个模型中，消费者可以订阅一个或多个 channel（频道），而生产者则向对应的 channel 发送消息。一旦消息被发送到某个 channel，所有订阅该 channel 的消费者都能收到这条消息。

#### **主要命令**
- **SUBSCRIBE channel [channel]**：用于订阅一个或多个频道。当有新消息发布到这些频道时，订阅者会立即收到通知。
- **PUBLISH channel msg**：用于向指定的频道发送消息。所有订阅该频道的消费者都会接收到这条消息。
- **PSUBSCRIBE pattern[pattern]**：用于订阅与指定模式匹配的所有频道。例如，`psubscribe order.*` 可以订阅所有以 `order.` 开头的频道。

#### **示例图解**
- **生产者** 使用 `publish order.queue msg1` 向 `order.queue` 频道发送消息 `msg1`。
- **消费者1** 使用 `subscribe order.queue` 订阅 `order.queue` 频道，接收到消息 `msg1`。
- **消费者2** 使用 `psubscribe order.*` 订阅所有以 `order.` 开头的频道，同样接收到消息 `msg1`。

#### **优缺点**
###### **优点**
- **支持多生产、多消费**：采用发布/订阅模型，允许多个生产者同时向同一个或多个频道发送消息，同时允许多个消费者订阅同一个或多个频道，实现高效的消息分发和处理。
- **实时性高**：消息一旦被发布到频道，所有订阅者会立即收到通知，适用于需要即时响应的场景。

###### **缺点**
- **不支持数据持久化**：Redis 的 Pub/Sub 模型不支持消息的持久化存储，一旦服务器重启或故障，未处理的消息将丢失。
- **无法避免消息丢失**：如果消费者在消息发布时未处于订阅状态，或者网络中断导致消息未能成功传输，消息将无法被消费者接收到。
- **消息堆积有上限**：Redis 对消息堆积的数量有一定的限制，当消息数量超出限制时，新的消息将被丢弃，导致数据丢失。

---

以下是整理后的笔记，包含基于 Redis Stream 结构实现异步秒杀下单的案例分析、代码实现和关键点说明。

---

### **1. 基于 Stream 的消息队列**

#### **简介**
Stream 是 Redis 5.0 引入的一种新数据类型，可以实现一个功能非常完善的消息队列。它支持消息的持久化存储、多消费者读取以及阻塞读取等功能。

#### **发送消息 - XADD 命令**
```bash
XADD key [NOMKSTREAM] [MAXLEN|MINID [=|-] threshold [LIMIT count]] * ID field value [field value ...]
```
- **参数说明**：
  - `key`：消息队列的名称。
  - `NOMKSTREAM`：如果队列不存在，是否自动创建队列，默认是自动创建。
  - `MAXLEN` 或 `MINID`：设置消息队列的最大消息数量或最小消息ID。
  - `threshold` 和 `LIMIT count`：用于限制消息队列的长度。
  - `*` 或 `ID`：消息的唯一ID，`*` 表示由Redis自动生成。
  - `field value [field value ...]`：发送到队列中的消息内容，格式为多个 key-value 键值对。

#### **示例**
```bash
# 创建名为 users 的消息队列，并向其中发送一条消息
127.0.0.1:6379> XADD users * name jack age 21
"164805700523-0"
```

#### **读取消息 - XREAD 命令**
```bash
XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] ID [ID ...]
```
- **参数说明**：
  - `COUNT count`：每次读取消息的最大数量。
  - `BLOCK milliseconds`：当没有消息时，是否阻塞、阻塞时长。
  - `STREAMS key [key ...]`：要从哪个队列读取消息，`key` 就是队列名。
  - `ID [ID ...]`：起始ID，只返回大于该ID的消息；`$` 代表从最新的消息开始；`0` 代表从第一个消息开始。

#### **示例**
```bash
# 使用XREAD阻塞方式，读取最新的消息
127.0.0.1:6379> XREAD COUNT 1 BLOCK 1000 STREAMS users $
(nil)
(1.07s)
```

#### **持续监听队列**
在业务开发中，可以通过循环调用 `XREAD` 阻塞方式来查询最新消息，从而实现持续监听队列的效果。伪代码如下：
```java
while (true) {
    // 尝试读取队列中的消息，最多阻塞2秒
    Object msg = redis.execute("XREAD COUNT 1 BLOCK 2000 STREAMS users $");
    if (msg == null) {
        continue;
    }
    // 处理消息
    handleMessage(msg);
}
```
- **注意**：
  - 当我们指定起始ID为 `$` 时，代表读取最新的消息。如果我们处理一条消息的过程中，又有超过1条以上的消息到达队列，则下次获取时也只能获取到最新的一条，会出现漏读消息的问题。

#### **特点总结**
- **消息永久存在**：消息会永久存储在 Redis 中，直到被手动删除或达到最大长度限制。
- **可回溯性**：可以通过指定不同的起始ID，读取历史消息。
- **多消费者读取**：一个消息可以被多个消费者读取，不会因为某个消费者读取而被删除。
- **阻塞读取**：支持阻塞读取，避免了轮询带来的性能开销。
- **防止消息遗漏**：在高并发场景下，需要合理设计起始ID的选取策略，避免漏读消息。

---

### **2. 基于 Stream 的消息队列 - 消费者组**

#### **消费者组（Consumer Group）**
- 将多个消费者划分到一个组中，监听同一个队列。具备以下特点：
  1. **消息分流**：队列中的消息会分流给组内的不同消费者，而不是重复消费，从而加快消息处理的速度。
  2. **消息标示**：消费者组会维护一个标示，记录最后一个被处理的消息，确保每个消息都会被消费。
  3. **消息确认**：消费者获取消息后，需要通过 `XACK` 来确认消息，标记消息为已处理，才会从 `pending-list` 移除。

#### **创建消费者组**
```bash
XGROUP CREATE key groupName ID [MKSTREAM]
```
- `key`：队列名称。
- `groupName`：消费者组名称。
- `ID`：起始ID标示，`$` 代表队列中最后一个消息，`0` 则代表队列中第一个消息。
- `MKSTREAM`：队列不存在时自动创建队列。

#### **其它常见命令**
- **删除指定的消费者组**：
  ```bash
  XGROUP DESTROY key groupName
  ```
- **给指定的消费者组添加消费者**：
  ```bash
  XGROUP CREATECONSUMER key groupName consumername
  ```
- **删除消费者组中的指定消费者**：
  ```bash
  XGROUP DELCONSUMER key groupName consumername
  ```

#### **从消费者组读取消息**
```bash
XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]
```
- `group`：消费者组名称。
- `consumer`：消费者名称，如果消费者不存在，会自动创建一个消费者。
- `count`：本次查询的最大数量。
- `BLOCK milliseconds`：当没有消息时最长等待时间。
- `NOACK`：无需手动 ACK，获取到消息后自动确认。
- `STREAMS key`：指定队列名称。
- `ID`：获取消息的起始ID：
  - `">"`：从下一个未消费的消息开始。
  - 其它：根据指定 id 从 `pending-list` 中获取已消费但未确认的消息。

#### **消息确认**
```bash
XACK key groupName message-id ...
```

#### **消费者监听消息的基本思路**
```java
while (true) {
    try {
        // 获取消息队列中的订单信息
        List<MapRecord<String, Object, Object>> list = stringRedisTemplate.opsForStream().read(
            Consumer.from("g1", "c1"),
            StreamReadOptions.empty().count(1).block(Duration.ofSeconds(2)),
            StreamOffset.create(queueName, ReadOffset.lastConsumed())
        );
        if (list == null || list.isEmpty()) {
            continue;
        }
        MapRecord<String, Object, Object> record = list.get(0);
        Map<Object, Object> values = record.getValue();
        VoucherOrder voucherOrder = BeanUtil.fillBeanWithMap(values, new VoucherOrder(), true);
        handleVoucherOrder(voucherOrder);
        // ACK确认
        stringRedisTemplate.opsForStream().acknowledge(queueName, "g1", record.getId());
    } catch (Exception e) {
        log.error("处理订单异常", e);
    }
}
```

---

### **3. 基于 Stream 实现异步秒杀**

#### **需求**
1. 创建一个 Stream 类型的消息队列，名为 `stream.orders`。
2. 修改之前的秒杀下单 Lua 脚本，在确认有抢购资格后，直接向 `stream.orders` 中添加消息，内容包括 `voucherId`、`userId`、`orderId`。
3. 项目启动时，开启一个线程任务，尝试获取 `stream.orders` 中的消息，完成下单。

#### **Lua 脚本实现**
```lua
-- 参数列表
local voucherId = ARGV[1]
local userId = ARGV[2]
local orderId = ARGV[3]

-- 数据 key
local stockKey = 'seckill:stock:' .. voucherId
local orderKey = 'seckill:order:' .. voucherId

-- 脚本业务
if tonumber(redis.call('get', stockKey)) <= 0 then
    return 1 -- 库存不足，返回1
end
if redis.call('sismember', orderKey, userId) == 1 then
    return 2 -- 存在，说明是重复下单，返回2
end
redis.call('incrby', stockKey, -1)
redis.call('sadd', orderKey, userId)
redis.call('xadd', 'stream.orders', '*', 'userId', userId, 'voucherId', voucherId, 'orderId', orderId)
return 0
```

#### **Java 代码实现**
```java
@Override
public Result seckillVoucher(Long voucherId) {
    Long userId = UserHolder.getUser().getId();
    long orderId = redisIdWorker.nextId("order");
    Long result = stringRedisTemplate.execute(
        SECKILL_SCRIPT,
        Collections.emptyList(),
        voucherId.toString(), userId.toString(), String.valueOf(orderId)
    );
    int r = result.intValue();
    if (r != 0) {
        return Result.fail(r == 1 ? "库存不足" : "不能重复下单");
    }
    proxy = (IVoucherOrderService) AopContext.currentProxy();
    return Result.ok(orderId);
}

public void run() {
    while (true) {
        try {
            List<MapRecord<String, Object, Object>> list = stringRedisTemplate.opsForStream().read(
                Consumer.from("g1", "c1"),
                StreamReadOptions.empty().count(1).block(Duration.ofSeconds(2)),
                StreamOffset.create(queueName, ReadOffset.lastConsumed())
            );
            if (list == null || list.isEmpty()) {
                continue;
            }
            MapRecord<String, Object, Object> record = list.get(0);
            Map<Object, Object> values = record.getValue();
            VoucherOrder voucherOrder = BeanUtil.fillBeanWithMap(values, new VoucherOrder(), true);
            handleVoucherOrder(voucherOrder);
            stringRedisTemplate.opsForStream().acknowledge(queueName, "g1", record.getId());
        } catch (Exception e) {
            log.error("处理订单异常", e);
        }
    }
}
```

---

#### ** 关键说明**

#### **pending-list 处理**
只需要将`if (list == null || list.isEmpty()) { continue; }`中 `continue` 改为 `break`。

#### **阻塞读取**
- 使用 `StreamReadOptions.empty().count(1).block(Duration.ofSeconds(2))` 设置阻塞读取，避免轮询带来的性能开销。

#### **消息回溯**
- 可以通过指定不同的起始ID，读取历史消息。例如：
  ```java
  StreamOffset.create(queueName, ReadOffsetTable.from("0"))
  ```

---

#### ** 总结**
- **使用 Stream 结构**：Redis Stream 提供了更完善的消息队列模型，支持消息持久化、确认机制和多消费者组。
- **Lua 脚本优化**：通过 Lua 脚本原子性地处理库存扣减和订单创建，确保数据一致性。
- **异步处理**：通过消费者监听消息并异步处理订单，提高系统的并发处理能力。

