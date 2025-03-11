# Tutorial on how to Code by Isaac

### **Original Code (Bad Example)**

This code is deeply nested, has duplicate logic, and uses unclear variable names.

---

```python
def proc(u):
    if u:
        if u.act:
            if u.p > 100:
                d = u.p * 0.9
                print(f"Total: {d}")
            else:
                print(f"Total: {u.p}")
```
> Let me guess, you understood ***shit***.

---

### **Step 1: Use Clear and Descriptive Naming**

We begin by renaming functions and variables so their purpose is immediately clear. For example, we change `proc` to `process_user`, `u` to `user`, `u.act` to `user.is_active`, and `u.p` to `user.price`.

```python
def process_user(user):
    if user and user.is_active:
        if user.price > 100:
            discounted_price = user.price * 0.9
            print(f"Total: {discounted_price}")
        else:
            print(f"Total: {user.price}")
```
> Wow! we can actually make sense of the code!
---

### **Step 2: Avoid Deep Nesting**

Next, we simplify the structure by using **early returns**. This avoids deeply nested conditionals, making the code more readable and easier to follow.

```python
def process_user(user):
    if not user or not user.is_active:
        return  # Exit early if the user is invalid or inactive

    if user.price > 100:
        discounted_price = user.price * 0.9
    else:
        discounted_price = user.price

    print(f"Total: {discounted_price}")
```
> This just makes it more readable. It makes it so the person reading your shit code does not get a memory leak from all the conditions he has to keep in mind.
---

### **Step 3: Extract Shared Logic to Avoid Duplication**

Finally, we extract the discount calculation into its own function. This keeps the logic DRY (Don't Repeat Yourself) and allows for easy reuse.

```python
def apply_discount(price):
    """Apply a 10% discount if the price is over 100."""
    return price * 0.9 if price > 100 else price

def process_user(user):
    if not user or not user.is_active:
        return  # Exit early if the user is invalid or inactive

    total_price = apply_discount(user.price)
    print(f"Total: {total_price}")
```
> This eliminates duplication and makes it dynamic in the future. if the code has to be reused, it will be simpler, faster and more efficient.
---

### **Final Version (Clean Code)**

✅ **Uses clear, meaningful names**  
✅ **Avoids deep nesting with early returns**  
✅ **Extracts shared logic to eliminate duplication**  

This refactored code is now **easier to read, maintain, and reuse**! 🚀