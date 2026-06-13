PEARSON BTEC LEVEL 5 HIGHER NATIONAL
Unit 27: Advanced Programming
Unit Code: Y/615/1651  |  Credit Value: 15

ASSIGNMENT BRIEF
BitePlate: Smart Restaurant Management System

Issuing Tutor	
Student Name	
Student ID	
Issue Date	
Submission Deadline	Week 4 — as advised by your tutor
Assignment Type	Individual Portfolio (4 Weeks)
Allowed Languages	Student's choice (Java, Python, C#, C++, etc. — justify your choice)
Word Count (Written)	Approx. 2,000 – 2,800 words across all written tasks



1. Introduction & Scenario

You have been hired as a junior software developer at a technology consultancy. Your first client is BitePlate, an ambitious restaurant chain that wants to replace its paper-based and legacy processes with a modern, maintainable software system. Your task is to design, document, and implement a prototype of the BitePlate Smart Restaurant Management System (SRMS) using Object-Oriented Programming principles and industry-recognised design patterns.

The BitePlate system must support the following core operational areas:
•Table Management — track table status through a full lifecycle: Free, Reserved, Occupied, Awaiting Bill, and Cleared
•Reservation System — allow customers to book tables in advance; send confirmation and reminder notifications to staff
•Order Management — waitstaff take orders and send them to the kitchen; orders can be modified or cancelled before preparation begins
•Kitchen Queue — a command-based queue that the kitchen team works through, with the ability to reprioritise or undo actions
•Meal & Menu Customisation — customers can customise dishes with add-ons, substitutions, and allergen requirements
•Combo & Set Meal Handling — the system must price and display individual items and multi-item deals uniformly
•Pricing & Discount Engine — apply different pricing strategies at runtime depending on time of day, customer loyalty tier, or group size
•Order History & Audit Log — a persistent, globally accessible record of all orders placed, including timestamps, table, staff member, and total — used for reporting and analytics
•Billing & POS — generate itemised bills, handle tips, split bills between guests, and calculate tax correctly
•Staff Role Management — different roles (Manager, Head Chef, Waiter, Cashier) have different permissions and system views

You are required to produce a full 4-week portfolio demonstrating your understanding of OOP, UML design, and design patterns. Your work must cover all four Learning Outcomes of Unit 27.

2. Learning Outcomes Covered

LO1	Examine the key components related to the object-orientated programming paradigm, analysing design pattern types
LO2	Design a series of UML class diagrams
LO3	Implement code applying design patterns
LO4	Investigate scenarios with respect to design patterns

3. Design Patterns in BitePlate — Reference Overview

The table below lists the ten design patterns available within the BitePlate scenario. You are not required to implement all of them; the tasks below specify the minimum requirements. Use this table to guide your decisions throughout the portfolio.

Pattern	Category	Applied To	Purpose in BitePlate
Command	Behavioural	Kitchen Action Queue	Encapsulate each kitchen action (Prepare, Cancel, Expedite) as an object; supports undo/redo of orders
Observer	Behavioural	Waiter Notification	Notify waitstaff and management automatically when an order status changes in the kitchen
Strategy	Behavioural	Discount / Pricing Engine	Swap pricing algorithms at runtime — Happy Hour, Loyalty Card, Group Discount, Corporate Account
State	Behavioural	Table & Order Lifecycle	Model table states explicitly: Free -> Reserved -> Occupied -> Awaiting Bill -> Cleared
Factory Method	Creational	Meal & Menu Item Creation	Delegate instantiation of Starter, Main, Dessert, and Beverage objects to subclass factories
Singleton	Creational	Order History Repository	Guarantee one global order history log accessible across all subsystems for audit and analytics
Iterator	Behavioural	Order History Traversal	Provide a uniform way to traverse order history records regardless of internal storage structure
Decorator	Structural	Meal Customisation	Dynamically add extras (allergen flag, special prep, side substitution) to any menu item at runtime
Facade	Structural	Billing & POS Interface	Expose a single, simple billing interface over complex tax calculation, tip handling, and split-bill logic
Composite	Structural	Set Meals & Combo Deals	Treat individual dishes and combo/set meals uniformly for pricing, display, and kitchen routing

Each pattern above maps to at least one concrete feature of the BitePlate system. Your task is to select, justify, design, and implement appropriate patterns — not simply to list them.



4. Assignment Tasks

Task 1 — OOP & Design Patterns Report  [LO1]
Write a structured report examining the object-oriented paradigm and design patterns as they apply to the BitePlate system. Your report must address all three sections below.

Section 1a — OOP Paradigm Characteristics  (Pass)
For each of the following OOP concepts, provide a clear explanation and a short code example or scenario-based illustration drawn from the BitePlate system:
•Encapsulation — how does BitePlate protect sensitive data such as billing totals or customer details?
•Polymorphism — how can a single method call handle a Starter, Main Course, or Dessert object?
•Inheritance — how do specialised staff roles or menu item types share common behaviour?
•Abstraction — what abstract classes or interfaces define the contracts in your system?
•Constructors and destructors — how are objects initialised and cleaned up in a restaurant session context?
•Generics and containers — where would you use a typed collection (e.g. a queue of orders or a list of menu items)?

Section 1b — OOP Class Relationships  (Pass)
Explain the following five class relationship types, giving a concrete BitePlate example for each:
•Generalisation / Inheritance — e.g. MenuItem -> Starter, Main, Dessert
•Realisation — e.g. a class implementing a Printable or Taxable interface
•Dependency — e.g. the Waiter class depending on the OrderService
•Aggregation — e.g. a Table holding a collection of Orders
•Composition — e.g. a Bill composed of BillLineItems that cannot exist independently

Section 1c — Design Pattern Analysis  (Pass / Merit / Distinction)
Identify and describe one design pattern from each of the three categories, chosen from the BitePlate reference table in Section 3:
•Creational — explain what problem it solves, its key participants, and why it suits BitePlate
•Structural — explain how it organises classes and objects to form larger structures
•Behavioural — explain how it manages communication and responsibility between objects

For Merit: evaluate the trade-offs of each pattern — what does it gain, and what complexity does it introduce?
For Distinction: write a 250–350 word analytical section arguing how OOP principles (especially abstraction and polymorphism) are the foundation that makes design patterns reusable and language-agnostic. Reference at least two of your chosen patterns explicitly.

Section 1d — Open-Ended Design Questions  (All grades — propose your own solutions)
BitePlate's product team has raised the following questions. For each one, write a short response (100–150 words) proposing which OOP technique or design pattern you would use and why. There is no single correct answer — you are assessed on the quality of your reasoning.

Question A — Allergy Alert System
A customer places an order containing a dish that is flagged as containing a common allergen. The system must immediately alert the kitchen, the waiter, and the manager. New alert recipients may be added in future without changing existing code. What pattern or OOP mechanism would you propose, and how would you structure it?

Question B — Dynamic Menu Pricing
BitePlate wants to run a 'Quiet Hours' pricing mode between 3pm and 5pm where all dishes are discounted by 20%, a 'Weekend Surcharge' on Saturday evenings, and a standard pricing mode at all other times. The pricing mode must switch automatically based on the time of day. How would you design this so that adding a new pricing mode in future requires minimal code changes?

Question C — Order History Analytics
The manager wants a dashboard showing the top 10 most ordered dishes over the past 30 days, average spend per table, and peak hour analysis. The data must come from the Order History Log. How would you structure the order history to make it easy to query? What pattern governs the log itself, and how would you traverse the records for reporting?

Question D — Legacy Kitchen Display System
BitePlate has a kitchen display screen purchased three years ago. Its software exposes a completely different interface to the one you are building. The manufacturer will not update the SDK. BitePlate wants your system to send orders to this screen without rewriting the display software. What structural pattern addresses this, and how would you apply it here?

Question E — Staff Permission System
Different staff roles need different levels of access: a Cashier can view and close bills but cannot modify kitchen orders; a Head Chef can reprioritise the kitchen queue but cannot access billing; a Manager can do everything. How would you model this using OOP? Consider whether a design pattern could make permission-checking easier to extend as new roles are added.

Suggested total word count for Task 1: 900–1,300 words. Code examples and pseudocode are encouraged and do not count toward the word limit.

Task 2 — UML Class & Activity Diagrams  [LO2]
Using a UML tool (Draw.io, Lucidchart, PlantUML, StarUML, or equivalent), produce the diagrams specified below. Export all diagrams as PNG or PDF and include them in your portfolio with written annotations explaining your design decisions.

2a — Core System Class Diagram  (Pass)
Model the main classes of the BitePlate system. Your diagram must include at minimum:
•MenuItem and its subclasses (Starter, MainCourse, Dessert, Beverage)
•ComboMeal / SetMeal — showing how it relates to individual MenuItem objects
•Order and OrderItem
•Table and its relationship to reservations and orders
•Staff and its subclasses (Waiter, Chef, Cashier, Manager)
•OrderHistoryLog — show this as a Singleton with the appropriate notation
•Bill and BillLineItem
Show correct UML notation: visibility modifiers (+, -, #), attribute types, method signatures, multiplicities, and all five relationship types where they occur.

2b — Design Pattern Class Diagrams  (Merit)
Produce a separate, clearly labelled class diagram for each of the following two patterns as they are implemented in BitePlate:
•Command Pattern — showing Command interface, ConcreteCommands (e.g. PrepareOrderCommand, CancelOrderCommand), Invoker (KitchenQueue), and Receiver (Chef)
•Observer Pattern — showing Subject interface, ConcreteSubject (Order), Observer interface, and ConcreteObservers (WaiterNotifier, ManagerDashboard, KitchenDisplay)
For each diagram, write 3–5 annotation notes explaining which participant maps to which BitePlate class and why.

Additionally, produce one class diagram of your own choice from the remaining patterns in the reference table. Justify your selection.

2c — UML Activity Diagrams  (Pass + Merit)
Draw a UML activity diagram for EACH of the following two workflows. Use swimlanes to show which actor (Customer, Waiter, Kitchen, System) performs each action.

Activity Diagram 1 — Full Order Lifecycle
Model the complete flow from a customer being seated to the bill being settled. Include: table assignment, order taking, kitchen queue entry, preparation stages, serving, bill generation, payment, and table clearance. Show decision points (e.g. order modification before cooking begins, payment method selection) and any concurrent flows.

Activity Diagram 2 — Order History Recording & Query
Model the flow from an order being confirmed through to it being written to the Order History Log, and then queried by the manager for a report. Show where the Singleton pattern controls access, where the Iterator traverses records, and how the analytics output is generated.

2d — Code-to-Diagram Derivation  (Distinction)
Your tutor will provide a short code snippet (approx. 30–50 lines) during Week 2. You must reverse-engineer a UML class diagram from that code and accompany it with a written paragraph (150–200 words) explaining the decisions you made — for example, which relationships you identified, any pattern you recognised, and any assumptions you made about missing context.

Tip: Use PlantUML text-based diagrams if you prefer version-controlled, reproducible outputs. Draw.io is recommended for beginners.

Task 3 — Code Implementation  [LO3]
Using a programming language of your choice, build a working prototype of the BitePlate system. Your README must include a one-paragraph justification of your language and IDE choice.

3a — Core Application  (Pass)
Implement the classes from your Task 2a class diagram. The application must:
•Demonstrate encapsulation, polymorphism, inheritance, and at least one interface or abstract class
•Allow a user (via console or simple GUI) to: seat a customer at a table, place an order with multiple items, view the kitchen queue, and generate a bill
•Apply secure coding practices: validate all user inputs, handle exceptions gracefully, and use no hardcoded sensitive values

3b — Design Pattern Implementation  (Merit)
Implement ALL THREE of the following patterns within your BitePlate codebase:

Pattern 1 — Command Pattern (Kitchen Queue)
-Create a Command interface with execute() and undo() methods
-Implement at least two ConcreteCommands: PrepareOrderCommand and CancelOrderCommand
-Build a KitchenQueue invoker that stores a history of commands and supports undo of the last action

Pattern 2 — Singleton (Order History Log)
-Implement an OrderHistoryLog class that can only be instantiated once
-Every confirmed order must be appended to the log with: order ID, table number, staff ID, items, total, and timestamp
-Implement an iterator or method that allows the manager to retrieve: all orders in a date range, orders for a specific table, and the most frequently ordered item

Pattern 3 — Strategy (Pricing / Discount Engine)
-Define a PricingStrategy interface with a calculateTotal(order) method
-Implement at least three concrete strategies: StandardPricing, HappyHourPricing (20% off), and LoyaltyCardPricing (10% off + free drink)
-The billing system must be able to swap strategies at runtime without changing the Bill class

Your three patterns must work together in at least one coherent flow — for example: a waiter places an order (Command), the strategy calculates the discounted price (Strategy), and the confirmed order is written to the history log (Singleton).

3c — Technical Evaluation  (Distinction)
Include a EVALUATION.md file (or a section in your README) of 300–400 words addressing:
•Were the three patterns you chose the best fit for their respective problems in BitePlate? What alternatives did you consider?
•What are the trade-offs of your Singleton implementation — specifically around testability and thread safety?
•If the system were to scale to a chain of 50 restaurants sharing one central database, which of your design decisions would need to change, and how?

Deliverable: A zipped folder containing all source files, a README.md with setup and run instructions, an EVALUATION.md, and at least four screenshots demonstrating the key features.

Task 4 — Design Pattern Scenario Investigation  [LO4]
BitePlate's business is growing. The following five scenarios represent new challenges the development team must solve. For each scenario, propose a design pattern solution and justify your choice. Reference the pattern reference table in Section 3 to guide your thinking, but you are not limited to those patterns.

Scenario A — The Expanding Menu
BitePlate wants to launch a new 'Build Your Own Burger' feature. Customers choose a base patty, then independently add or remove toppings, sauces, and sides — each with its own price contribution. The menu engineering team estimates there could be over 200 possible combinations. New toppings will be added seasonally. The system must calculate the correct price and display a clear summary for both the customer and the kitchen. How would you structure the MenuItem class hierarchy to handle this without creating hundreds of subclasses?

Scenario B — The Reservation Reminder Pipeline
When a customer makes a reservation, the system must: send a confirmation SMS, add the booking to the manager's calendar view, update the table availability display, and — two hours before the booking — send a reminder SMS. Each of these actions is performed by a different subsystem. The product owner wants to be able to add new actions (e.g. a WhatsApp message, a loyalty points credit) without touching the reservation logic. Which pattern or combination of patterns would you propose, and how would the new actions be added?

Scenario C — The Franchise Rollout
BitePlate is opening five new franchise locations. Each location has its own menu variations (e.g. a coastal branch adds a seafood section; a city-centre branch has a 'grab and go' option). The core system must remain the same, but each branch needs to instantiate the correct menu item types for its location. The head office team does not want franchise owners modifying the core codebase. What creational pattern family would you recommend to manage location-specific object creation, and how would you structure it?

Scenario D — The End-of-Night Report
At closing time, the manager runs an end-of-night report that must: iterate through all orders in the history log, calculate total revenue by category (food vs drinks), identify the top three waitstaff by covers served, flag any orders that were cancelled after preparation began (a waste metric), and export a summary. The order history may contain hundreds of records and its internal storage format may change in future. How would you structure the traversal and reporting logic so that changing the storage format does not break the reporting code?

Scenario E — The Multi-Screen Kitchen
BitePlate's larger restaurants have three kitchen stations: a hot station, a cold station, and a dessert station. When an order is sent to the kitchen, different items must be routed to different screens. A burger goes to hot, a salad goes to cold, and a cheesecake goes to dessert. The head chef also needs a master view showing all active orders across all stations. Currently all kitchen commands go to one queue. How would you redesign the kitchen queue to support multi-station routing, while keeping the waiter's interface simple and unchanged?

For each scenario, your answer must include:
•The design pattern(s) you recommend, with justification
•A brief explanation of any alternative patterns you considered and why you did not choose them
•(For Merit) A clear, reasoned match between the pattern's intent and the specific problem
•(For Distinction) A critical comparison of at least two competing patterns for one scenario, with a final justified recommendation

Suggested word count for Task 4: 700–1,000 words. Diagrams or pseudocode may be included to support your answers.

Task 5 — Reflective Portfolio Journal  [All LOs]
Write a personal reflective journal entry of 350–500 words. Write in first person. Your reflection should address:
•What aspect of this assignment challenged you most, and how did you approach overcoming it?
•Which design pattern did you find most intellectually interesting, and why?
•How has working on a real-world scenario (a restaurant system) changed the way you think about software design compared to abstract exercises?
•Looking at your Task 4 open-ended questions: was there a scenario where you genuinely struggled to identify the right pattern? What did that process reveal about your current understanding?
•What would you do differently in your UML design or code if you had another week?

The journal is assessed on genuine critical reflection, not length. Avoid summarising what you did — focus on what you learned, what surprised you, and what you would change.



5. Assessment Criteria & Grading

The table below maps each task to the Pass, Merit, and Distinction criteria from the Unit 27 specification. To be awarded Merit or Distinction, all lower-level criteria must also be satisfied.

Task	Pass	Merit	Distinction	Evidence Required
Task 1
OOP & Patterns Report	P1: Examine OOP characteristics and class relationships	M1: Determine one pattern from each category (Creational, Structural, Behavioural)	D1: Analyse the relationship between the OOP paradigm and design patterns	Written report 900–1,300 words with code/pseudocode examples
Task 2
UML Diagrams	P2: Design and build class diagrams using a UML tool	M2: Define class diagrams for specific design patterns	D2: Derive class diagrams from a given code snippet; justify decisions	Class diagrams + Activity diagrams (PNG/PDF) with written annotations
Task 3
Code Implementation	P3: Build an application derived from your UML class diagrams	M3: Develop code implementing a design pattern for a given purpose	D3: Evaluate use of design patterns — trade-offs, alternatives, improvements	Zipped source code + README + screenshots of running application
Task 4
Scenario Investigation	P4: Discuss a range of design patterns with relevant examples	M4: Match the most appropriate pattern to each scenario with clear reasoning	D4: Critically evaluate all scenarios with justified recommendations	Written analysis 700–1,000 words
Task 5
Reflective Journal	Completion and submission of all tasks	Quality of critical reasoning throughout the portfolio	Evidence of independent thinking and self-directed evaluation	Reflective journal 350–500 words

Partial completion of Merit or Distinction criteria will result in the lower grade being awarded. Where a task spans multiple grades, the highest grade achieved in that task is recorded.

6. Suggested 4-Week Timeline

Week	Phase	Key Activities	Deliverable
Week 1	Research & Theory	Study OOP concepts and map all ten design patterns to BitePlate features. Write Task 1 report — OOP paradigm characteristics, class relationships, and one pattern per category. Include pseudocode examples drawn from the restaurant context.	Task 1 draft (OOP & Patterns Report)
Week 2	UML Design	Produce the core system class diagram (Task 2a). Build pattern-specific class diagrams for at least two patterns (Task 2b). Draw UML activity diagrams for the Order Lifecycle and Kitchen Queue workflows. Annotate all diagrams clearly.	Task 2 complete: all diagrams exported and annotated
Week 3	Code Implementation	Choose your programming language and IDE — justify your choice in your README. Build the BitePlate application from your UML diagrams. Implement at least two design patterns in code. Apply secure coding practices: validate inputs, handle exceptions, avoid hardcoded values. Test each feature and capture screenshots.	Task 3: zipped source code + README + screenshots
Week 4	Evaluation & Portfolio	Write Task 4 scenario investigation — analyse all five open-ended scenarios and justify your design pattern recommendations. Complete Task 5 reflective journal. Review, proofread, and package all components into your final portfolio submission.	Final portfolio submitted via learning platform

This timeline is a guide only. You are responsible for managing your own time across the four weeks. Late submissions are subject to your institution's late submission policy. We strongly recommend submitting Task 1 for informal formative feedback at the end of Week 1.

7. Submission Requirements

Your final portfolio must include all of the following components:
•Task 1 Report — word-processed document (.pdf or .docx) including all five open-ended question responses
•Task 2 UML Diagrams — all class diagrams and activity diagrams exported as PNG or PDF, with written annotations. The code-derivation diagram (2d) should be in the same document as your annotation.
•Task 3 Source Code — a zipped folder containing: all source files, README.md with setup and run instructions, EVALUATION.md (or equivalent section), and at least four screenshots of the application running
•Task 4 Scenario Investigation — included in the Task 1 document or as a separate clearly labelled document
•Task 5 Reflective Journal — included as the final section of your written document

All written documents must include your full name, student ID, unit title, and unit code in a header or footer on every page.
Submit via the learning platform as instructed by your tutor. Password-protected archives and Google Drive links will not be accepted.

8. Academic Integrity

All work submitted must be your own. You may use textbooks, documentation, and online resources for reference and learning. You must:
•Cite all sources in a reference list (Harvard referencing is recommended)
•Not copy code or written content from peers, online repositories, or AI tools without proper attribution and understanding
•Be prepared to explain and discuss any part of your submission if asked by your tutor

Use of AI coding assistants (e.g. GitHub Copilot, ChatGPT) is permitted as a learning aid only. Code generated by AI tools must be reviewed, understood, and substantially adapted by you. Submitting AI-generated code without modification or comprehension constitutes academic misconduct and may result in a failing grade.

9. Recommended Resources

Books
•Gamma, E. et al. (1994) Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.
•Freeman, E. & Robson, E. (2020) Head First Design Patterns (2nd ed.). O'Reilly.
•Martin, R.C. (2008) Clean Code: A Handbook of Agile Software Craftsmanship. Prentice Hall.
•Bloch, J. (2018) Effective Java (3rd ed.). Addison-Wesley.

Online Resources
•Refactoring.Guru — https://refactoring.guru/design-patterns (full pattern catalogue with examples in Java, Python, C#, and more)
•SourceMaking — https://sourcemaking.com/design_patterns
•PlantUML — https://plantuml.com (text-based UML, excellent for class and activity diagrams)
•Draw.io — https://app.diagrams.net (free browser-based UML tool, recommended for beginners)
•UML Distilled (summary) — https://martinfowler.com/books/uml.html

UML Tools
•Draw.io / diagrams.net — free, no account required, exports to PNG and PDF
•Lucidchart — free tier available, collaborative
•StarUML — free trial, desktop application, good for class diagrams
•PlantUML — text-based, integrates with VS Code and IntelliJ IDEA



Good luck — we look forward to seeing your BitePlate system come to life!
Unit 27: Advanced Programming  |  Y/615/1651  |  BTEC Level 5