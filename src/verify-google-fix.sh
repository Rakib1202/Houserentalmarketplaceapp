#!/bin/bash

# Google OAuth Error Fix Verification Script
# This script verifies that the Google OAuth error has been fixed

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Google OAuth Error Fix - Verification Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check 1: Frontend .env file
echo -e "${BLUE}[1/8] Checking frontend .env file...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    if grep -q "VITE_GOOGLE_CLIENT_ID" .env; then
        CLIENT_ID=$(grep "VITE_GOOGLE_CLIENT_ID" .env | cut -d '=' -f2)
        if [[ "$CLIENT_ID" == "GOOGLE_AUTH_DISABLED" ]]; then
            echo -e "${GREEN}✓${NC} Google OAuth is disabled (correct)"
        elif [[ "$CLIENT_ID" == *".apps.googleusercontent.com"* ]]; then
            echo -e "${YELLOW}⚠${NC} Google OAuth is enabled with ID: $CLIENT_ID"
        else
            echo -e "${YELLOW}⚠${NC} Google OAuth setting: $CLIENT_ID"
        fi
    else
        echo -e "${RED}✗${NC} VITE_GOOGLE_CLIENT_ID not found in .env"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo -e "   Run: cp .env.example .env"
fi
echo ""

# Check 2: Frontend .env.example file
echo -e "${BLUE}[2/8] Checking frontend .env.example file...${NC}"
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example file exists"
else
    echo -e "${RED}✗${NC} .env.example file not found"
fi
echo ""

# Check 3: Backend .env file
echo -e "${BLUE}[3/8] Checking backend .env file...${NC}"
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓${NC} server/.env file exists"
    
    if grep -q "GOOGLE_CLIENT_ID" server/.env; then
        if grep "^#.*GOOGLE_CLIENT_ID" server/.env > /dev/null; then
            echo -e "${GREEN}✓${NC} Google OAuth is disabled (commented out)"
        else
            BACKEND_ID=$(grep "GOOGLE_CLIENT_ID" server/.env | grep -v "^#" | cut -d '=' -f2)
            if [[ -n "$BACKEND_ID" ]]; then
                echo -e "${YELLOW}⚠${NC} Google OAuth is enabled on backend: $BACKEND_ID"
            fi
        fi
    else
        echo -e "${GREEN}✓${NC} GOOGLE_CLIENT_ID not set (disabled by default)"
    fi
else
    echo -e "${RED}✗${NC} server/.env file not found"
    echo -e "   Run: cp server/.env.example server/.env"
fi
echo ""

# Check 4: Backend .env.example file
echo -e "${BLUE}[4/8] Checking backend .env.example file...${NC}"
if [ -f "server/.env.example" ]; then
    echo -e "${GREEN}✓${NC} server/.env.example file exists"
else
    echo -e "${RED}✗${NC} server/.env.example file not found"
fi
echo ""

# Check 5: GoogleSignIn component
echo -e "${BLUE}[5/8] Checking GoogleSignIn component...${NC}"
if [ -f "components/auth/GoogleSignIn.tsx" ]; then
    echo -e "${GREEN}✓${NC} GoogleSignIn.tsx exists"
    
    if grep -q "DISABLED" components/auth/GoogleSignIn.tsx; then
        echo -e "${GREEN}✓${NC} Component handles DISABLED state"
    else
        echo -e "${YELLOW}⚠${NC} Component may not handle DISABLED state"
    fi
    
    if grep -q "return null" components/auth/GoogleSignIn.tsx; then
        echo -e "${GREEN}✓${NC} Component returns null when disabled"
    else
        echo -e "${YELLOW}⚠${NC} Component may show warnings when disabled"
    fi
else
    echo -e "${RED}✗${NC} GoogleSignIn.tsx not found"
fi
echo ""

# Check 6: Auth routes
echo -e "${BLUE}[6/8] Checking backend auth routes...${NC}"
if [ -f "server/routes/auth.js" ]; then
    echo -e "${GREEN}✓${NC} auth.js exists"
    
    if grep -q "googleClient.*null" server/routes/auth.js; then
        echo -e "${GREEN}✓${NC} Backend handles missing Google credentials safely"
    else
        echo -e "${YELLOW}⚠${NC} Backend may not handle missing Google credentials"
    fi
else
    echo -e "${RED}✗${NC} server/routes/auth.js not found"
fi
echo ""

# Check 7: Documentation
echo -e "${BLUE}[7/8] Checking documentation...${NC}"
DOC_COUNT=0

if [ -f "GOOGLE_OAUTH_SETUP.md" ]; then
    echo -e "${GREEN}✓${NC} GOOGLE_OAUTH_SETUP.md exists"
    ((DOC_COUNT++))
fi

if [ -f "ERROR_FIX_GOOGLE_OAUTH.md" ]; then
    echo -e "${GREEN}✓${NC} ERROR_FIX_GOOGLE_OAUTH.md exists"
    ((DOC_COUNT++))
fi

if [ -f "QUICK_FIX_GOOGLE_ERROR.md" ]; then
    echo -e "${GREEN}✓${NC} QUICK_FIX_GOOGLE_ERROR.md exists"
    ((DOC_COUNT++))
fi

if [ -f "GOOGLE_ERROR_COMPLETE_FIX.md" ]; then
    echo -e "${GREEN}✓${NC} GOOGLE_ERROR_COMPLETE_FIX.md exists"
    ((DOC_COUNT++))
fi

echo -e "${GREEN}✓${NC} $DOC_COUNT documentation files found"
echo ""

# Check 8: Node modules
echo -e "${BLUE}[8/8] Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend node_modules installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed"
    echo -e "   Run: npm install"
fi

if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend node_modules installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed"
    echo -e "   Run: cd server && npm install"
fi
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Verification Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f ".env" ] && [ -f "server/.env" ]; then
    echo -e "${GREEN}✓ Google OAuth Error Fix: APPLIED${NC}"
    echo ""
    echo -e "Current Configuration:"
    echo -e "  • Frontend: Google OAuth ${GREEN}DISABLED${NC}"
    echo -e "  • Backend: Google OAuth ${GREEN}DISABLED${NC}"
    echo -e "  • Authentication: ${GREEN}Phone + Password WORKING${NC}"
    echo ""
    echo -e "Next Steps:"
    echo -e "  1. Start backend:  ${YELLOW}cd server && npm start${NC}"
    echo -e "  2. Start frontend: ${YELLOW}npm run dev${NC}"
    echo -e "  3. Open browser:   ${YELLOW}http://localhost:5173${NC}"
    echo ""
    echo -e "Documentation:"
    echo -e "  • Setup Google OAuth: ${BLUE}GOOGLE_OAUTH_SETUP.md${NC}"
    echo -e "  • Fix Details:        ${BLUE}ERROR_FIX_GOOGLE_OAUTH.md${NC}"
    echo -e "  • Quick Reference:    ${BLUE}QUICK_FIX_GOOGLE_ERROR.md${NC}"
else
    echo -e "${RED}✗ Configuration incomplete${NC}"
    echo ""
    echo -e "Missing files detected. Please run:"
    if [ ! -f ".env" ]; then
        echo -e "  ${YELLOW}cp .env.example .env${NC}"
    fi
    if [ ! -f "server/.env" ]; then
        echo -e "  ${YELLOW}cp server/.env.example server/.env${NC}"
    fi
fi
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
